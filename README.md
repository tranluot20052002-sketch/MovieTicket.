# MovieTicket2 - Website đặt vé xem phim trực tuyến

Đồ án môn học: website đặt vé xem phim trực tuyến xây dựng bằng **Node.js + Express + PostgreSQL** và giao diện **Single Page Application (SPA)** thuần JavaScript.

## Tính năng đã hoàn thiện

### Trang (pages)
- **Trang chủ** – giới thiệu, đăng nhập / đăng ký
- **Danh sách phim** – xem phim, lọc theo trạng thái / thể loại, xem chi tiết phim
- **Lịch chiếu** – chọn ngày (10 ngày), xem suất chiếu theo phim và định dạng (2D/3D/IMAX/4DX), chọn ghế trực tuyến
- **Vé của tôi** – đặt vé theo mã suất + ghế, lịch sử đặt vé, vé điện tử (mã vạch SVG, in vé, tải vé)
- **Liên hệ** – thông tin rạp, form gửi phản hồi (lưu vào CSDL)

### Chức năng thêm – sửa – xóa (đầy đủ CRUD)
| Nghiệp vụ | Thêm | Sửa | Xoá | Vai trò |
|---|---|---|---|---|
| Phim (movies) | ✅ | ✅ | ✅ (xoá luôn suất chiếu) | Admin |
| Suất chiếu (showtimes) | ✅ | ✅ | ✅ (chặn nếu đã có vé) | Admin |
| Liên hệ (contacts) | ✅ (form trang Liên hệ) | ✅ (đổi trạng thái) | ✅ | Khách hàng gửi / Admin quản lý |
| Đặt vé (bookings) | ✅ | – | – | Khách hàng |

### Bảo mật & dữ liệu
- Mật khẩu mã hoá **bcrypt** (salt rounds 10), không bao giờ lưu plaintext
- Xác thực **JWT** (Bearer token, hiệu lực 1 giờ), phân quyền **admin** cho các thao tác quản lý
- Truy vấn tham số hoá (`$1, $2...`) chống SQL injection; thoát hoá HTML ở client chống XSS
- Đặt vé trong **transaction** + `SELECT ... FOR UPDATE`: chống đặt trùng ghế, chống bán quá số ghế (overbooking) khi nhiều người đặt đồng thời
- Kết nối CSDL **PostgreSQL** qua connection pool (pg)

## Yêu cầu hệ thống
- Node.js 18+ (khuyến nghị 20+)
- PostgreSQL 14+ (cổng mặc định 5432)

## Cài đặt và chạy

```bash
# 1. Cài dependency
npm install

# 2. Tạo database (chạy trong psql hoặc pgAdmin)
createdb movieticket_db

# 3. Cấu hình .env (đã có sẵn mẫu, chỉnh nếu cần)
PORT=5000
DB_USER=postgres
DB_PASSWORD=123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movieticket_db
JWT_SECRET=doi-thanh-khoa-bi-cua-ban
JWT_EXPIRES_IN=1h

# 4. Chạy server (tự tạo bảng từ schema.sql)
npm run dev          # hoặc: npm start

# 5. (Tuỳ chọn) seed dữ liệu mẫu: tài khoản admin + 4 phim + suất chiếu hôm nay
npm run seed
```

Mở trình duyệt: **http://localhost:5000**

**Tài khoản admin mẫu (sau khi seed):**
- Email: `admin@example.com`
- Mật khẩu: `admin123`

> Ảnh poster mẫu đã có trong `public/images/movies/`. Thêm ảnh khác vào thư mục này và nhập tên file khi thêm phim.

## API endpoints

| Method | Path | Quyền | Mô tả |
|---|---|---|---|
| GET | `/` | – | Thông báo API đang chạy |
| GET | `/health` | – | Kiểm tra kết nối CSDL |
| POST | `/api/auth/register` | – | Đăng ký tài khoản |
| POST | `/api/auth/login` | – | Đăng nhập (trả về JWT) |
| GET | `/api/movies` | – | Danh sách phim (lọc `status`, `genre`) |
| GET | `/api/movies/:id` | – | Chi tiết phim |
| POST | `/api/movies` | Admin | Thêm phim |
| PUT | `/api/movies/:id` | Admin | Sửa phim |
| DELETE | `/api/movies/:id` | Admin | Xoá phim (kèm suất chiếu) |
| GET | `/api/showtimes` | – | Suất chiếu (lọc `date=YYYY-MM-DD`, `movieId`) |
| GET | `/api/showtimes/:id` | – | Chi tiết suất chiếu |
| POST | `/api/showtimes` | Admin | Thêm suất chiếu |
| PUT | `/api/showtimes/:id` | Admin | Sửa suất chiếu |
| DELETE | `/api/showtimes/:id` | Admin | Xoá suất chiếu |
| POST | `/api/bookings` | Customer | Đặt vé (`showtimeId`, `seatNumbers[]`) |
| GET | `/api/bookings/history` | Customer | Lịch sử đặt vé |
| POST | `/api/contacts` | – | Gửi liên hệ |
| GET | `/api/contacts` | Admin | Danh sách liên hệ |
| PUT | `/api/contacts/:id` | Admin | Cập nhật liên hệ (trạng thái/nội dung) |
| DELETE | `/api/contacts/:id` | Admin | Xoá liên hệ |

## Cấu trúc dự án

```
MovieTicket2/
├── server.js                   # Khởi chạy server, mount routes, xử lý lỗi tập trung
├── schema.sql                  # DDL: users, movies, rooms-free showtimes, bookings, contacts
├── seed.js                     # Seed dữ liệu mẫu (admin + phim + suất chiếu)
├── package.json
├── .env                        # Cấu hình môi trường
├── config/db.js                # Pool kết nối PostgreSQL + khởi tạo schema
├── middleware/
│   ├── authMiddleware.js       # Xác thực JWT
│   └── requireAdmin.js         # Phân quyền admin
├── routes/                     # auth, movies, showtimes, bookings, contacts
├── controllers/                # Xử lý nghiệp vụ từng module
└── public/                     # Frontend SPA (index.html, app.js, styles.css, images)
```

## Up code lên GitHub

```bash
# 1. Khởi tạo repository
git init
git add .
git commit -m "Hoan thien do an MovieTicket2: CRUD phim/suat chieu/lien he, trang lien he, dat ve"

# 2. Tao repo tren github.com (New repository, khong tich README)
#    -> nhấn "creating a new repository" lay lenh push
git branch -M main
git remote add origin https://github.com/<ten-user>/<ten-repo>.git
git push -u origin main
```

Sau đó gửi link `https://github.com/<ten-user>/<ten-repo>` vào hệ thống bài tập.

> Nếu không dùng được Git, cách thay thế: chạy `npm run dev`, chụp ảnh các trang (trang chủ, danh sách phim, lịch chiếu, vé của tôi, liên hệ), ghép vào file Word và up lên Google Drive rồi gửi link.

## Ghi chú
- CSDL mặc định là **PostgreSQL** (tương đương yêu cầu "kết nối CSDL, ví dụ MySQL"). Nếu muốn dùng MySQL, thay `pg` bằng `mysql2` và dịch lại các câu SQL ( cú pháp `TEXT[]`, `ILIKE`, `TIMESTAMPTZ` cần đổi tương ứng).
- Endpoint `POST /api/movies` yêu cầu quyền admin (không còn công khai) để đúng phân quyền quản trị.
