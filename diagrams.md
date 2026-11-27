# 5 Sơ Đồ Bắt Buộc - MovieTicket2

Copy từng block dưới vào **draw.io** (Arrange → Insert → Advanced → Mermaid) hoặc **Mermaid Live Editor** → Xuất PNG → Chèn vào Word.

---

## 1. Use Case Diagram (Đã có)
Actor: **Khách**, **Admin**

```mermaid
useCaseDiagram
    package "MovieTicket2" {
        actor "Khách" as Khach
        actor "Admin" as Admin
        
        usecase "Đăng ký/Đăng nhập" as UC1
        usecase "Xem danh sách phim" as UC2
        usecase "Xem lịch chiếu" as UC3
        usecase "Chọn ghế & Đặt vé" as UC4
        usecase "Xem lịch sử vé/In vé" as UC5
        usecase "Gửi liên hệ" as UC6
        
        usecase "Quản lý phim (CRUD)" as UC7
        usecase "Quản lý suất chiếu (CRUD)" as UC8
        usecase "Quản lý liên hệ" as UC9
        usecase "Xem thống kê" as UC10
    }
    
    Khach --> UC1
    Khach --> UC2
    Khach --> UC3
    Khach --> UC4
    Khach --> UC5
    Khach --> UC6
    
    Admin --> UC1
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
```

---

## 2. ERD - Sơ Đồ Thực Thể Liên Kết (Entity Relationship Diagram)

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "đặt"
    MOVIES ||--o{ SHOWTIMES : "có"
    SHOWTIMES ||--o{ BOOKINGS : "thuộc"
    CONTACTS }|--|| USERS : "khách gửi (tùy chọn)"

    USERS {
        BIGSERIAL id PK
        VARCHAR full_name
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR phone
        VARCHAR role "customer/admin"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    MOVIES {
        BIGSERIAL id PK
        VARCHAR title
        TEXT description
        INTEGER duration_minutes
        VARCHAR genre
        DATE release_date
        TEXT poster_url
        VARCHAR age_rating "P/C13/C16/C18"
        VARCHAR status "upcoming/showing/ended"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    SHOWTIMES {
        BIGSERIAL id PK
        BIGINT movie_id FK
        TIMESTAMPTZ start_time
        TIMESTAMPTZ end_time
        VARCHAR room
        VARCHAR cinema_name
        VARCHAR format "2D/3D/IMAX/4DX"
        NUMERIC price
        INTEGER available_seats
        VARCHAR status "available/cancelled/completed"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    BOOKINGS {
        BIGSERIAL id PK
        BIGINT user_id FK
        BIGINT showtime_id FK
        VARCHAR booking_code UK
        TEXT[] seat_numbers
        NUMERIC total_price
        VARCHAR status "pending/confirmed/cancelled/completed"
        TIMESTAMPTZ booked_at
        TIMESTAMPTZ updated_at
    }

    CONTACTS {
        BIGSERIAL id PK
        VARCHAR full_name
        VARCHAR email
        VARCHAR phone
        TEXT message
        VARCHAR status "new/read/done"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
```

---

## 3. Sequence Diagram - Luồng Đặt Vé (Booking Flow)

```mermaid
sequenceDiagram
    autonumber
    actor User as Khách
    participant FE as Frontend (SPA)
    participant API as Express API
    participant DB as PostgreSQL

    User->>FE: Chọn phim & suất chiếu
    FE->>API: GET /api/showtimes?date=2026-10-13
    API->>DB: SELECT * FROM showtimes JOIN movies...
    DB-->>API: Danh sách suất chiếu
    API-->>FE: JSON showtimes
    FE-->>User: Hiển thị lịch chiếu + nút "Chọn ghế"

    User->>FE: Click "Chọn ghế" suất chiếu #123
    FE->>API: GET /api/showtimes/123
    API->>DB: SELECT * FROM showtimes WHERE id=123
    DB-->>API: Showtime detail (available_seats=48)
    API-->>FE: JSON showtime
    FE-->>User: Hiển thị sơ đồ ghế (A1-A8, B1-B8...)

    User->>FE: Chọn ghế A1, A2 → Click "Xác nhận đặt vé"
    FE->>API: POST /api/bookings {showtimeId:123, seatNumbers:["A1","A2"]}
    API->>DB: BEGIN TRANSACTION
    API->>DB: SELECT * FROM showtimes WHERE id=123 FOR UPDATE
    API->>DB: SELECT seat_numbers FROM bookings WHERE showtime_id=123 AND status IN ('pending','confirmed')
    alt Ghế trống
        API->>DB: INSERT INTO bookings (user_id, showtime_id, booking_code, seat_numbers, total_price, status='confirmed')
        API->>DB: UPDATE showtimes SET available_seats=46 WHERE id=123
        API->>DB: COMMIT
        DB-->>API: Booking created (booking_code="MT2A3F9")
        API-->>FE: 201 {booking, ticket_info}
        FE-->>User: Hiển thị vé điện tử (Mã vé, QR, ghế, thời gian)
    else Ghế đã đặt / Hết vé
        API->>DB: ROLLBACK
        API-->>FE: 409 {message: "Ghế đã được đặt"}
        FE-->>User: Toast error "Ghế A1 đã có người đặt"
    end
```

---

## 4. Activity Diagram - Quy Trình Nghiệp Vụ Đặt Vé

```mermaid
flowchart TD
    Start([Bắt đầu]) --> Login{Khách đã đăng nhập?}
    Login -- Chưa --> Redirect[Chuyển về trang Đăng nhập]
    Redirect --> Login
    Login -- Rồi --> SelectMovie[Chọn phim & suất chiếu]
    SelectMovie --> SelectSeats[Chọn ghế trên sơ đồ]
    SelectSeats --> ValidateSeats{Ghế còn trống?}
    ValidateSeats -- Không --> ShowError[Hiển thị lỗi: Ghế đã đặt]
    ShowError --> SelectSeats
    ValidateSeats -- Có --> ConfirmBooking[Xác nhận đặt vé]
    ConfirmBooking --> CallAPI[Gọi POST /api/bookings]
    CallAPI --> DBTrans[(DB Transaction:\n1. Kiểm tra ghế FOR UPDATE\n2. Insert booking\n3. Update available_seats)]
    DBTrans --> Result{Kết quả?}
    Result -- Thất bại --> ShowError
    Result -- Thành công --> ShowTicket[Hiển thị vé điện tử<br/>Mã vé, QR Code, Ghế, Suất chiếu]
    ShowTicket --> SaveHistory[Lưu vào lịch sử đặt vé]
    SaveHistory --> End([Kết thúc])
    
    style Start fill:#e8f5e9
    style End fill:#ffebee
    style ShowError fill:#fff3e0
    style ShowTicket fill:#e3f2fd
```

---

## 5. Architecture / Deployment Diagram - Kiến Trúc Hệ Thống

```mermaid
flowchart LR
    subgraph Client["🌐 Client (Browser)"]
        FE["Frontend: HTML/CSS/Vanilla JS\n(Single Page Application)\nPort: 5000 (static)"]
    end

    subgraph Server["⚙️ Backend Server (Node.js/Express)"]
        API["REST API\nPort: 5000\n/api/auth, /api/movies\n/api/showtimes, /api/bookings\n/api/contacts"]
        Auth["JWT Middleware\n+ bcrypt\n+ Role Guard (admin/customer)"]
        Ctrl["Controllers:\nAuth, Movies, Showtimes\nBookings, Contacts"]
    end

    subgraph DB["🗄️ Database (PostgreSQL)"]
        PG[(movieticket_db\nTables: users, movies\nshowtimes, bookings, contacts)]
    end

    subgraph Assets["📁 Static Assets"]
        IMG["/public/images/movies/\nPoster phim (jpg, png, webp)"]
        CSS["/public/styles.css"]
        JS["/public/app.js"]
    end

    User((👤 Người dùng)) --> FE
    FE <-->|HTTP/JSON + JWT| API
    API --> Auth
    Auth --> Ctrl
    Ctrl <-->|pg Pool| PG
    FE -->|Static files| CSS
    FE -->|Static files| JS
    FE -->|Image src| IMG

    style FE fill:#e3f2fd
    style API fill:#fff3e0
    style PG fill:#e8f5e9
    style Auth fill:#fce4ec
```

---

## 6. (Bonus) Sequence Diagram - Luồng Đăng Nhập/Phân Quyền

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE
    participant API
    participant DB

    User->>FE: Nhập email/password → Click Đăng nhập
    FE->>API: POST /api/auth/login {email, password}
    API->>DB: SELECT * FROM users WHERE email=$1
    DB-->>API: User row (password_hash)
    API->>API: bcrypt.compare(password, hash)
    alt Sai mật khẩu
        API-->>FE: 401 {message: "Sai email/mật khẩu"}
        FE-->>User: Toast error
    else Đúng
        API->>API: jwt.sign({userId, role}, SECRET, {expiresIn: '1h'})
        API-->>FE: 200 {token, user: {id, full_name, email, role}}
        FE->>FE: localStorage.setItem('token', token)
        FE->>FE: localStorage.setItem('user', JSON.stringify(user))
        FE-->>User: Chuyển trang "Vé của tôi" + hiển thị Avatar + Badge Admin
    end

    Note over FE,API: Các request sau gắn Header:\nAuthorization: Bearer <token>
    
    User->>FE: Click "Thêm phim" (chỉ Admin thấy)
    FE->>API: POST /api/movies {title...} + Authorization
    API->>API: authenticateToken → requireAdmin
    alt Role = admin
        API->>DB: INSERT INTO movies...
        API-->>FE: 201 {movie}
    else Role = customer
        API-->>FE: 403 {message: "Yêu cầu quyền admin"}
    end
```

---

## 📸 Checklist Xuất Hình Ảnh (5 ảnh)

| # | Sơ đồ | File xuất | Chèn vào Word ở mục |
|---|-------|-----------|---------------------|
| 1 | Use Case | `usecase.png` | 2.1 Phân tích yêu cầu |
| 2 | ERD | `erd.png` | 3.1 Thiết kế CSDL |
| 3 | Sequence Đặt Vé | `seq-booking.png` | 3.2 Luồng xử lý chính |
| 4 | Activity Đặt Vé | `activity-booking.png` | 3.3 Quy trình nghiệp vụ |
| 5 | Architecture | `architecture.png` | 3.4 Kiến trúc hệ thống |

> **Mẹo**: Dùng [Mermaid Live Editor](https://mermaid.live/) → Paste code → Settings → Theme: `default` → Download PNG (2x scale cho nét).