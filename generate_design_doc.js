/* Generator: Phan tich - thiet ke do an MovieTicket2 (.docx) - pure Node.js */
const fs = require('fs');
const path = require('path');

/* ---------------- XML helpers ---------------- */
const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function run(text, opts = {}) {
  const rPr = [];
  const font = opts.font || 'Times New Roman';
  rPr.push(`<w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}"/>`);
  if (opts.bold) rPr.push('<w:b/>');
  if (opts.italic) rPr.push('<w:i/>');
  const size = (opts.size || 13) * 2;
  rPr.push(`<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`);
  if (opts.color) rPr.push(`<w:color w:val="${opts.color}"/>`);
  return `<w:r><w:rPr>${rPr.join('')}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function para(runs, opts = {}) {
  const pPr = [];
  const before = opts.before ?? 0;
  const after = opts.after ?? 60;
  const line = opts.line ?? 312;
  pPr.push(`<w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/>`);
  if (opts.align) pPr.push(`<w:jc w:val="${opts.align}"/>`);
  if (opts.indent) pPr.push(`<w:ind w:left="${opts.indent}"${opts.hanging ? ` w:hanging="${opts.hanging}"` : ''}/>`);
  if (opts.keepNext) pPr.push('<w:keepNext/>');
  if (opts.shading) pPr.push(`<w:shd w:val="clear" w:color="auto" w:fill="${opts.shading}"/>`);
  return `<w:p><w:pPr>${pPr.join('')}</w:pPr>${runs}</w:p>`;
}

const h1 = (text) => para(run(text, { bold: true, size: 14 }), { before: 360, after: 120, align: 'left', keepNext: true });
const h2 = (text) => para(run(text, { bold: true, italic: true, size: 13 }), { before: 200, after: 100, align: 'left', keepNext: true });
const p = (text) => para(run(text), { align: 'justify' });
const center = (text, opts = {}) => para(run(text, opts), { align: 'center', after: opts.after ?? 60 });
const bullet = (text) => para(run('\u2022  ' + text), { align: 'justify', indent: 480, hanging: 240 });
const numbered = (n, text) => para(run(`${n}. ${text}`), { align: 'justify', indent: 560, hanging: 320 });
const pageBreak = () => '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';

function codeBlock(lines, caption) {
  const out = [];
  if (caption) out.push(para(run(caption, { bold: true, italic: true, size: 11 }), { before: 160, after: 60, keepNext: true }));
  const codeLines = Array.isArray(lines) ? lines : lines.split('\n');
  out.push('<w:p><w:pPr><w:spacing w:before="40" w:after="40" w:line="240" w:lineRule="auto"/><w:ind w:left="170" w:right="170"/><w:shd w:val="clear" w:color="auto" w:fill="F2F4F8"/><w:jc w:val="left"/></w:pPr>'
    + codeLines.map((ln) => run(ln === '' ? ' ' : ln, { font: 'Consolas', size: 9.5 })).join('<w:r><w:br/></w:r>')
    + '</w:p>');
  out.push(para('', { after: 80 }));
  return out.join('');
}

function caption(text) {
  return para(run(text, { bold: true, italic: true, size: 11 }), { before: 200, after: 80, keepNext: true, align: 'left' });
}

function table(headers, rows, widths) {
  const total = widths.reduce((s, w) => s + w, 0);
  const borders = ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']
    .map((side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="8C94A6"/>`).join('');
  const grid = `<w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`;
  const cellXml = (text, isHeader, width) => {
    const runs = run(String(text), { bold: isHeader, size: 11 });
    const tcPr = `<w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${isHeader ? '<w:shd w:val="clear" w:color="auto" w:fill="DDE3F0"/>' : ''}</w:tcPr>`;
    return `<w:tc>${tcPr}<w:p><w:pPr><w:spacing w:before="30" w:after="30" w:line="264" w:lineRule="auto"/><w:jc w:val="left"/></w:pPr>${runs}</w:p></w:tc>`;
  };
  const trs = [];
  trs.push(`<w:tr><w:trPr><w:tblHeader/></w:trPr>${headers.map((hd, i) => cellXml(hd, true, widths[i])).join('')}</w:tr>`);
  rows.forEach((row) => {
    trs.push(`<w:tr>${row.map((cell, i) => cellXml(cell, false, widths[i])).join('')}</w:tr>`);
  });
  return `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="${total}" w:type="dxa"/><w:tblBorders>${borders}</w:tblBorders><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr>${grid}${trs.join('')}</w:tbl>`
    + para('', { after: 100 });
}

/* ---------------- Content ---------------- */
const B = [];
const add = (...items) => B.push(...items);

/* ===== Trang bìa ===== */
add(para('', { after: 2200 }));
add(center('TRƯỜNG ĐẠI HỌC ...............', { size: 13, after: 80 }));
add(center('KHOA ...............', { size: 13, after: 1400 }));
add(center('PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG', { bold: true, size: 17, after: 160 }));
add(center('ĐỀ TÀI: XÂY DỰNG WEBSITE ĐẶT VÉ XEM PHIM TRỰC TUYẾN', { bold: true, size: 14, after: 60 }));
add(center('MovieTicket2', { bold: true, size: 16, color: '4941D6', after: 700 }));
add(center('Phần 1: Phân tích yêu cầu website', { size: 12, after: 60 }));
add(center('Phần 2: Thiết kế Use Case', { size: 12, after: 60 }));
add(center('Phần 3: Thiết kế cơ sở dữ liệu', { size: 12, after: 500 }));
add(center('Sinh viên: Họ và tên ...............', { size: 12, after: 60 }));
add(center('Lớp: ...............      MSSV: ...............', { size: 12, after: 60 }));
add(center('Giảng viên hướng dẫn: ...............', { size: 12, after: 60 }));
add(center('Ngày thực hiện: 13/10/2026', { size: 12, after: 60 }));
add(pageBreak());

/* ===== Mục lục ===== */
add(h1('MỤC LỤC'));
[
  'Phần 1: Phân tích yêu cầu website',
  '1.1. Giới thiệu đề tài',
  '1.2. Yêu cầu chức năng',
  '1.3. Yêu cầu phi chức năng',
  '1.4. Yêu cầu dữ liệu và nghiệp vụ chính',
  'Phần 2: Thiết kế Use Case',
  '2.1. Xác định diễn viên (actor)',
  '2.2. Sơ đồ use case',
  '2.3. Mối quan hệ giữa các use case',
  '2.4. Mô tả tổng hợp các use case',
  '2.5. Mô tả chi tiết luồng use case chính',
  'Phần 3: Thiết kế cơ sở dữ liệu',
  '3.1. Nguyên tắc thiết kế',
  '3.2. Sơ đồ thực thể – liên kết (ERD)',
  '3.3. Từ điển dữ liệu chi tiết (06 bảng)',
  '3.4. Ràng buộc toàn vẹn và chỉ mục',
  '3.5. Script DDL hoàn chỉnh',
  '3.6. Ánh xạ thiết kế với mã nguồn hiện tại',
  'Kết luận',
].forEach((t) => add(para(run(t), { align: 'left', after: 30 })));
add(pageBreak());

/* ===== PHAN 1 ===== */
add(h1('PHẦN 1: PHÂN TÍCH YÊU CẦU WEBSITE'));
add(h2('1.1. Giới thiệu đề tài'));
add(p('Website đặt vé xem phim trực tuyến MovieTicket2 cho phép người dùng tra cứu danh mục phim, xem lịch chiếu theo ngày, chọn ghế trực tuyến và nhận vé điện tử có mã vạch, đồng thời cho phép quản trị viên quản lý danh mục phim và suất chiếu. Phần này phân tích các yêu cầu chức năng, yêu cầu phi chức năng và yêu cầu dữ liệu làm nền tảng cho việc thiết kế use case và cơ sở dữ liệu ở hai phần sau.'));
add(h2('1.2. Yêu cầu chức năng'));
add(p('Yêu cầu chức năng được nhóm theo tám nhóm nghiệp vụ, gắn với vai trò sử dụng (khách hàng – customer, quản trị viên – admin, khách vãng lai – guest):'));
add(caption('Bảng 1.1: Yêu cầu chức năng của website MovieTicket2'));
add(table(
  ['Mã', 'Nhóm chức năng', 'Yêu cầu chi tiết', 'Vai trò'],
  [
    ['F1', 'Xác thực tài khoản', 'Đăng ký tài khoản (họ tên, email, mật khẩu ≥ 6 ký tự, số điện thoại tuỳ chọn); đăng nhập trả về JWT; đăng xuất; tự động hết phiên khi token hết hạn', 'Customer, Admin'],
    ['F2', 'Tra cứu phim', 'Xem danh sách phim kèm poster, thể loại, thời lượng, trạng thái và giá vé từ; lọc theo trạng thái (sắp chiếu/đang chiếu/đã chiếu) và thể loại; xem chi tiết phim trong hộp thoại', 'Customer, Admin, Guest'],
    ['F3', 'Lịch chiếu', 'Xem lịch chiếu theo ngày (dải 10 ngày), nhóm suất theo định dạng (2D/3D/IMAX) và ngôn ngữ (lồng tiếng/phụ đề); làm mới lịch', 'Customer, Admin'],
    ['F4', 'Đặt vé', 'Chọn suất chiếu; chọn từ 1 đến 10 ghế trên sơ đồ ghế A–F × 8; không cho phép chọn ghế trùng; tính tổng tiền theo thời gian thực; tạo mã vé duy nhất; cập nhật số ghế trống', 'Customer'],
    ['F5', 'Quản lý vé', 'Xem lịch sử đặt vé (mới nhất lên đầu); xem lại vé điện tử bất kỳ lúc nào; in vé và tải vé về máy', 'Customer'],
    ['F6', 'Quản lý phim', 'Thêm phim mới (tên, thời lượng, thể loại, ngày khởi chiếu, trạng thái, mô tả, ảnh poster); xoá phim (kèm toàn bộ suất chiếu, chỉ admin)', 'Admin'],
    ['F7', 'Quản lý suất chiếu (mở rộng)', 'Thêm/sửa/xoá suất chiếu theo phim, phòng, ngày giờ; đặt giá vé và số ghế khả dụng; huỷ suất chiếu', 'Admin'],
    ['F8', 'Thống kê (mở rộng)', 'Xem doanh thu theo ngày/phim/phòng; số lượng vé đã bán; tỷ lệ lấp đầy suất chiếu', 'Admin'],
  ],
  [600, 1900, 4871, 1700],
));
add(h2('1.3. Yêu cầu phi chức năng'));
add(caption('Bảng 1.2: Yêu cầu phi chức năng'));
add(table(
  ['STT', 'Nhóm', 'Yêu cầu'],
  [
    ['1', 'Hiệu năng', 'Phản hồi API dưới 300 ms cho thao tác đơn giản; dùng connection pool của PostgreSQL; tải danh sách phim không quá 2 giây trên mạng nội bộ'],
    ['2', 'Bảo mật', 'Mật khẩu lưu dạng băm bcrypt (salt rounds = 10); xác thực JWT (thời hạn 1 giờ); truy vấn tham số hoá chống SQL injection; thoát hoá HTML chống XSS; không trả mật khẩu hash ra client; khoá bí mật nằm ngoài mã nguồn (.env)'],
    ['3', 'Toàn vẹn dữ liệu', 'Transaction ACID cho đặt vé và xoá phim; khoá hàng SELECT ... FOR UPDATE chống đặt trùng ghế và overbooking khi nhiều người đặt đồng thời; ràng buộc CHECK/UNIQUE/FOREIGN KEY trên CSDL'],
    ['4', 'Khả dụng', 'Giao diện SPA không tải lại trang; hiển thị tốt từ 320 px trở lên (responsive); thông báo lỗi bằng tiếng Việt, rõ ràng'],
    ['5', 'Tương thích', 'Hoạt động trên các trình duyệt hiện đại (Chrome, Edge, Firefox); dữ liệu JSON chuẩn; ngày giờ hiển thị theo locale vi-VN'],
    ['6', 'Bảo trì', 'Kiến trúc phân tầng routes – controllers – middleware – config; đặt tên nhất quán; DDL tập trung trong schema.sql, tự động khởi tạo khi server chạy'],
  ],
  [600, 1700, 6771],
));
add(h2('1.4. Yêu cầu dữ liệu và nghiệp vụ chính'));
add(p('Hệ thống quản lý sáu thực thể dữ liệu chính: tài khoản người dùng (users), danh mục phim (movies), phòng chiếu (rooms), suất chiếu (showtimes), đơn đặt vé (bookings – đóng vai trò "hoá đơn vé") và giao dịch thanh toán (payments). Các nghiệp vụ trọng tâm đặt ra yêu cầu dữ liệu đặc thù:'));
add(bullet('Đặt vé phải ghi nhận được nhiều ghế trong một đơn (sử dụng kiểu mảng TEXT[]), tính tổng tiền = đơn giá × số ghế, và sinh mã vé duy nhất để in/tải vé.'));
add(bullet('Mỗi suất chiếu thuộc đúng một phim và một phòng, không thể trùng giờ trong cùng một phòng (ràng buộc UNIQUE).'));
add(bullet('Số ghế trống của suất chiếu phải được cập nhật nguyên tử cùng lúc với việc tạo đơn vé, tránh bán quá số ghế (overbooking).'));
add(bullet('Xoá phim phải xoá luôn các suất chiếu liên quan (ON DELETE CASCADE) để không để lại dữ liệu mồ côi.'));
add(pageBreak());

/* ===== PHAN 2 ===== */
add(h1('PHẦN 2: THIẾT KẾ USE CASE'));
add(h2('2.1. Xác định diễn viên (actor)'));
add(caption('Bảng 2.1: Các diễn viên tham gia hệ thống'));
add(table(
  ['Diễn viên', 'Mô tả', 'Đặc điểm'],
  [
    ['Khách hàng (Customer)', 'Người xem phim đã đăng ký tài khoản', 'Được đặt vé, xem lịch sử vé, nhận vé điện tử'],
    ['Quản trị viên (Admin)', 'Nhân viên quản lý rạp', 'Toàn quyền của khách hàng + quản lý phim, suất chiếu, xem thống kê'],
    ['Khách vãng lai (Guest)', 'Người chưa đăng nhập', 'Chỉ xem danh sách phim và chi tiết phim công khai'],
  ],
  [2600, 3200, 3271],
));
add(h2('2.2. Sơ đồ use case'));
add(p('Sơ đồ use case mô tả các chức năng hệ thống theo từng diễn viên (ký hiệu <<include>> là use case con bắt buộc, <<extend>> là use case mở rộng tuỳ chọn):'));
add(codeBlock([
  '                          +--------------------------------------------------+',
  '                          |              WEBSITE MOVIETICKET2                |',
  '                          |                                                  |',
  '  (Khach vang lai)  ----> |  UC3  Xem danh sach phim                         |',
  '                          |  UC4  Xem chi tiet phim                          |',
  '                          |                                                  |',
  '  (Khach hang)      ----> |  UC1  Dang ky tai khoan                          |',
  '                          |  UC2  Dang nhap  <<-- gom cho UC6, UC7, UC9 >> |',
  '                          |  UC3  Xem danh sach phim                         |',
  '                          |  UC4  Xem chi tiet phim                          |',
  '                          |  UC5  Xem lich chieu                             |',
  '                          |  UC6  Chon ghe va dat ve      -->> UC12 (extend)|',
  '                          |  UC7  Xem lich su va ve dien tu                  |',
  '                          |  UC8  Dang xuat                                  |',
  '                          |                                                  |',
  '  (Quan tri vien)   ----> |  UC2  Dang nhap                                  |',
  '                          |  UC9  Them phim moi                              |',
  '                          |  UC10 Xoa phim                                   |',
  '                          |  UC11 Quan ly suat chieu                         |',
  '                          |  UC12 Thanh toan ve (mo rong)                    |',
  '                          |  UC13 Xem thong ke doanh thu                     |',
  '                          +--------------------------------------------------+',
], 'Hình 2.1: Sơ đồ use case hệ thống MovieTicket2 (dạng ký hiệu)'));
add(p('Cùng sơ đồ trên ở dạng chuẩn UML (có thể dán vào mermaid.live hoặc GitHub để xem hình trực quan):'));
add(codeBlock([
  'useCaseDiagram',
  'actor "Khách vãng lai" as Guest',
  'actor "Khách hàng" as Customer',
  'actor "Quản trị viên" as Admin',
  '',
  'usecase "Đăng ký tài khoản" as UC1',
  'usecase "Đăng nhập" as UC2',
  'usecase "Xem danh sách phim" as UC3',
  'usecase "Xem chi tiết phim" as UC4',
  'usecase "Xem lịch chiếu" as UC5',
  'usecase "Chọn ghế và đặt vé" as UC6',
  'usecase "Xem lịch sử và vé điện tử" as UC7',
  'usecase "Đăng xuất" as UC8',
  'usecase "Thêm phim mới" as UC9',
  'usecase "Xoá phim" as UC10',
  'usecase "Quản lý suất chiếu" as UC11',
  'usecase "Thanh toán vé" as UC12',
  'usecase "Xem thống kê doanh thu" as UC13',
  '',
  'Guest --> UC3',
  'Guest --> UC4',
  'Customer --> UC1',
  'Customer --> UC2',
  'Customer --> UC3',
  'Customer --> UC4',
  'Customer --> UC5',
  'Customer --> UC6',
  'Customer --> UC7',
  'Customer --> UC8',
  'Admin --> UC2',
  'Admin --> UC3',
  'Admin --> UC4',
  'Admin --> UC5',
  'Admin --> UC9',
  'Admin --> UC10',
  'Admin --> UC11',
  'Admin --> UC13',
  'UC6 ..> UC2 : <<include>>',
  'UC7 ..> UC2 : <<include>>',
  'UC9 ..> UC2 : <<include>>',
  'UC6 ..> UC12 : <<extend>>',
], 'Hình 2.2: Sơ đồ use case dạng Mermaid UML'));
add(h2('2.3. Mối quan hệ giữa các use case'));
add(caption('Bảng 2.2: Quan hệ include / extend giữa các use case'));
add(table(
  ['Use case gốc', 'Quan hệ', 'Use case liên quan', 'Giải thích'],
  [
    ['UC6 – Chọn ghế và đặt vé', '<<include>>', 'UC2 – Đăng nhập', 'Bắt buộc phải đăng nhập mới đặt vé được; hệ thống tự chuyển hướng nếu chưa đăng nhập'],
    ['UC7 – Xem lịch sử và vé điện tử', '<<include>>', 'UC2 – Đăng nhập', 'Chỉ chủ tài khoản mới xem được lịch sử của mình'],
    ['UC9 – Thêm phim mới / UC10 – Xoá phim', '<<include>>', 'UC2 – Đăng nhập (admin)', 'Chỉ quản trị viên đã đăng nhập mới thực hiện được'],
    ['UC6 – Chọn ghế và đặt vé', '<<extend>>', 'UC12 – Thanh toán vé', 'Mở rộng tuỳ chọn: sau khi đặt vé có thể thanh toán trực tuyến (thiết kế cho giai đoạn sau)'],
    ['UC3 – Xem danh sách phim', 'gồm', 'UC4 – Xem chi tiết phim', 'Nhấn vào một phim để xem chi tiết trong modal'],
  ],
  [2900, 1200, 2100, 2871],
));
add(h2('2.4. Mô tả tổng hợp các use case'));
add(caption('Bảng 2.3: Mô tả tổng hợp 13 use case'));
add(table(
  ['Mã', 'Use case', 'Diễn viên', 'Mô tả ngắn', 'Tiên quyết'],
  [
    ['UC1', 'Đăng ký tài khoản', 'Khách hàng', 'Tạo tài khoản mới với email duy nhất, nhận JWT sau khi đăng ký', 'Chưa đăng nhập'],
    ['UC2', 'Đăng nhập', 'Khách hàng, Admin', 'Xác minh email – mật khẩu, cấp token phiên làm việc', 'Có tài khoản'],
    ['UC3', 'Xem danh sách phim', 'Tất cả', 'Hiển thị phim kèm giá vé từ, hỗ trợ lọc trạng thái/thể loại', 'Không'],
    ['UC4', 'Xem chi tiết phim', 'Tất cả', 'Xem đầy đủ thông tin một phim trong modal', 'Không'],
    ['UC5', 'Xem lịch chiếu', 'Khách hàng, Admin', 'Xem suất chiếu theo ngày, nhóm theo định dạng', 'Không'],
    ['UC6', 'Chọn ghế và đặt vé', 'Khách hàng', 'Chọn 1–10 ghế, tạo đơn vé, cập nhật ghế trống, nhận mã vé', 'Đã đăng nhập (include UC2)'],
    ['UC7', 'Xem lịch sử và vé điện tử', 'Khách hàng', 'Xem danh sách vé đã đặt, mở lại vé, in/tải vé', 'Đã đăng nhập (include UC2)'],
    ['UC8', 'Đăng xuất', 'Khách hàng, Admin', 'Huỷ phiên cục bộ, xoá token khỏi trình duyệt', 'Đã đăng nhập'],
    ['UC9', 'Thêm phim mới', 'Admin', 'Nhập thông tin phim và thêm vào danh mục', 'Đã đăng nhập quyền admin'],
    ['UC10', 'Xoá phim', 'Admin', 'Xoá phim cùng toàn bộ suất chiếu', 'Đã đăng nhập quyền admin'],
    ['UC11', 'Quản lý suất chiếu', 'Admin', 'Thêm/sửa/xoá/huỷ suất chiếu theo phim và phòng', 'Đã đăng nhập quyền admin'],
    ['UC12', 'Thanh toán vé', 'Khách hàng', 'Thanh toán trực tuyến cho đơn vé (MoMo/ZaloPay/VNPAY)', 'Có đơn vé UC6 (extend)'],
    ['UC13', 'Xem thống kê doanh thu', 'Admin', 'Doanh thu theo ngày/phim/phòng, tỷ lệ lấp đầy', 'Đã đăng nhập quyền admin'],
  ],
  [600, 2200, 1700, 3300, 1271],
));
add(h2('2.5. Mô tả chi tiết luồng use case chính'));
add(p('UC1 – Đăng ký tài khoản'));
add(numbered(1, 'Điều kiện tiên quyết: người dùng chưa đăng nhập; điều kiện hậu tố: tài khoản mới được tạo, người dùng nhận được JWT và được tự động đăng nhập.'));
add(numbered(2, 'Luồng chính: người dùng chuyển tab "Đăng ký" → nhập họ tên, email, mật khẩu (≥ 6 ký tự), số điện thoại (tuỳ chọn) → bấm Đăng ký → hệ thống validate → chuẩn hoá email (lowercase) → băm mật khẩu bcrypt → lưu user role "customer" → tạo JWT → trả token và thông tin user.'));
add(numbered(3, 'Luồng thay thế: email sai định dạng hoặc mật khẩu < 6 ký tự → thông báo 400; email đã tồn tại → thông báo 409 và yêu cầu dùng email khác.'));
add(p('UC2 – Đăng nhập'));
add(numbered(1, 'Điều kiện tiên quyết: có tài khoản đã đăng ký; điều kiện hậu tố: người dùng nhận JWT (hiệu lực 1 giờ) và trạng thái phiên được cập nhật trên giao diện.'));
add(numbered(2, 'Luồng chính: nhập email và mật khẩu → hệ thống tìm user theo email đã chuẩn hoá → bcrypt.compare mật khẩu với hash → nếu đúng: tạo JWT, xoá password_hash khỏi dữ liệu trả về, trả 200 kèm token và user; giao diện lưu token vào localStorage và chuyển sang mục "Vé của tôi".'));
add(numbered(3, 'Luồng thay thế: sai email hoặc mật khẩu → 401 "Email hoặc mật khẩu không đúng"; token hết hạn khi gọi API → 403 và giao diện tự động đăng xuất (xử lý 401).'));
add(p('UC6 – Chọn ghế và đặt vé (use case nghiệp vụ cốt lõi)'));
add(numbered(1, 'Điều kiện tiên quyết: đã đăng nhập (include UC2), suất chiếu còn trạng thái "available"; điều kiện hậu tố: đơn vé status "confirmed" được tạo, available_seats giảm đúng số ghế đặt, người dùng nhận vé điện tử.'));
add(numbered(2, 'Luồng chính: chọn ngày trong dải 10 ngày → xem danh sách suất theo phim/định dạng → bấm suất chiếu → modal sơ đồ ghế 6 dãy × 8 cột hiện ra → tick ghế (1–10 ghế), tổng tiền cập nhật theo thời gian thực → bấm "Xác nhận đặt vé" → hệ thống BEGIN transaction, SELECT ... FOR UPDATE khoá suất chiếu → kiểm tra trạng thái và số ghế trống → kiểm tra trùng ghế với các đơn pending/confirmed → tính tổng tiền, sinh mã vé 12 ký tự → INSERT booking → UPDATE giảm available_seats → COMMIT → hiển thị vé điện tử (mã vạch SVG), chuyển sang "Vé của tôi".'));
add(numbered(3, 'Luồng thay thế: ghế đã bị đặt (409 kèm danh sách ghế xung đột), hết ghế (409), suất bị huỷ (409), chọn quá 10 ghế hoặc ghế trùng trong một request (400) → giữ nguyên trạng thái CSDL (ROLLBACK), thông báo và cho chọn lại.'));
add(p('UC9 – Thêm phim mới (quản trị viên)'));
add(numbered(1, 'Điều kiện tiên quyết: đã đăng nhập role "admin"; điều kiện hậu tố: phim mới có status mặc định "upcoming" xuất hiện trong danh sách.'));
add(numbered(2, 'Luồng chính: điền form (tên, thời lượng nguyên dương, thể loại, ngày khởi chiếu, trạng thái, mô tả, tên file ảnh trong public/images/movies) → bấm Thêm phim → validate → INSERT movies RETURNING → thông báo thành công và tải lại danh sách.'));
add(numbered(3, 'Luồng thay thế: thiếu tên hoặc thời lượng không hợp lệ → 400; (thiết kế đề xuất) thêm ảnh upload thật thay vì nhập tên file.'));
add(pageBreak());

/* ===== PHAN 3 ===== */
add(h1('PHẦN 3: THIẾT KẾ CƠ SỞ DỮ LIỆU'));
add(h2('3.1. Nguyên tắc thiết kế'));
add(bullet('Chuẩn hoá đến dạng 3NF: mỗi bảng mô tả đúng một thực thể, không dư thừa dữ liệu (giá vé nằm ở showtimes, không lặp trong bookings).'));
add(bullet('Đặt tên tiếng Anh, snake_case, khoá chính dạng BIGSERIAL (tự tăng 64 bit), khoá ngoại rõ ràng với hành vi xoá CASCADE phù hợp nghiệp vụ.'));
add(bullet('Mọi thời gian dùng TIMESTAMPTZ (có múi giờ), tiền dùng NUMERIC(12,2) tránh sai số dấu phẩy động, danh sách ghế dùng mảng TEXT[].'));
add(bullet('Ràng buộc CHECK giữ giá trị trong miền hợp lệ (status, role, rating...), UNIQUE bảo vệ tính duy nhất nghiệp vụ (email, mã vé, phòng–giờ chiếu).'));
add(h2('3.2. Sơ đồ thực thể – liên kết (ERD)'));
add(codeBlock([
  '  +----------------+                     +-----------------+',
  '  |     USERS      |                     |     ROOMS       |',
  '  | (khach hang &  |                     |  (phong chieu)  |',
  '  |   admin)       |                     |                 |',
  '  | PK user_id     |                     | PK room_id      |',
  '  +--------+-------+                     +--------+--------+',
  '           | 1                                   | 1',
  '           |                                     |',
  '           | n                                   | n',
  '  +--------v---------------------+   +-----------v----------+',
  '  |         BOOKINGS             |   |      SHOWTIMES       |',
  '  |   (don dat ve / hoa don)    |   |     (suat chieu)     |',
  '  | PK booking_id                |   | PK showtime_id       |',
  '  | FK user_id -> USERS          |   | FK movie_id -> MOVIES|',
  '  | FK showtime_id -> SHOWTIMES  |   | FK room_id -> ROOMS  |',
  '  +------------------------------+   +-----------+----------+',
  '           | 1                                   | 1',
  '           |                                     |',
  '           | 0..1                                | n',
  '  +--------v---------+                 +----------v--------+',
  '  |    PAYMENTS      |                 |      MOVIES       |',
  '  |  (thanh toan)    |                 |     (phim)        |',
  '  | PK payment_id    |                 | PK movie_id       |',
  '  | FK booking_id    |                 |                   |',
  '  +------------------+                 +-------------------+',
  '',
  'QUAN HE:',
  '  USERS     1 --- n BOOKINGS      (mot khach hang dat nhieu ve)',
  '  MOVIES    1 --- n SHOWTIMES     (mot phim co nhieu suat chieu)',
  '  ROOMS     1 --- n SHOWTIMES     (mot phong co nhieu suat chieu)',
  '  SHOWTIMES 1 --- n BOOKINGS      (mot suat co nhieu don ve)',
  '  BOOKINGS  1 --- 0..1 PAYMENTS   (mot don ve co toi mot giao dich)',
], 'Hình 3.1: Sơ đồ ERD hệ thống MovieTicket2 (06 thực thể)'));
add(p('Giải thích quan hệ: USERS và BOOKINGS là quan hệ một–nhiều (một tài khoản đặt nhiều vé). MOVIES – SHOWTIMES và ROOMS – SHOWTIMES cũng là một–nhiều, tạo thành "chuỗi" MOVIES → SHOWTIMES → BOOKINGS → USERS. PAYMENTS phụ thuộc hoàn toàn vào BOOKINGS (quan hệ 1 – 0..1, mỗi đơn vé có tối đa một giao dịch thanh toán).'));
add(h2('3.3. Từ điển dữ liệu chi tiết (06 bảng)'));
add(caption('Bảng 3.1: USERS – tài khoản người dùng (khách hàng & quản trị viên)'));
add(table(
  ['STT', 'Tên cột', 'Kiểu dữ liệu', 'Ràng buộc', 'Mô tả'],
  [
    ['1', 'user_id', 'BIGSERIAL', 'PRIMARY KEY', 'Mã người dùng, tự tăng'],
    ['2', 'full_name', 'VARCHAR(100)', 'NOT NULL', 'Họ và tên'],
    ['3', 'email', 'VARCHAR(255)', 'NOT NULL, UNIQUE', 'Email đăng nhập, chuẩn hoá lowercase'],
    ['4', 'password_hash', 'VARCHAR(255)', 'NOT NULL', 'Mật khẩu đã băm bcrypt (không lưu plaintext)'],
    ['5', 'phone', 'VARCHAR(20)', '', 'Số điện thoại (tuỳ chọn)'],
    ['6', 'avatar_url', 'VARCHAR(255)', '', 'Đường dẫn ảnh đại diện'],
    ['7', 'role', 'VARCHAR(20)', "NOT NULL, DEFAULT 'customer', CHECK IN ('customer','admin')", 'Vai trò phân quyền'],
    ['8', 'is_active', 'BOOLEAN', "DEFAULT TRUE", 'Tài khoản còn hoạt động'],
    ['9', 'created_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm tạo'],
    ['10', 'updated_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm cập nhật cuối'],
  ],
  [500, 1800, 1600, 2900, 2271],
));
add(caption('Bảng 3.2: MOVIES – danh mục phim'));
add(table(
  ['STT', 'Tên cột', 'Kiểu dữ liệu', 'Ràng buộc', 'Mô tả'],
  [
    ['1', 'movie_id', 'BIGSERIAL', 'PRIMARY KEY', 'Mã phim, tự tăng'],
    ['2', 'title', 'VARCHAR(255)', 'NOT NULL', 'Tên phim'],
    ['3', 'description', 'TEXT', '', 'Mô tả nội dung phim'],
    ['4', 'duration_minutes', 'INTEGER', 'NOT NULL, CHECK (> 0)', 'Thời lượng (phút)'],
    ['5', 'genre', 'VARCHAR(100)', '', 'Thể loại (Hành động, Tình cảm...)'],
    ['6', 'release_date', 'DATE', '', 'Ngày khởi chiếu'],
    ['7', 'poster_url', 'VARCHAR(255)', '', 'Đường dẫn ảnh poster'],
    ['8', 'trailer_url', 'VARCHAR(255)', '', 'Đường dẫn trailer (mở rộng)'],
    ['9', 'age_rating', 'VARCHAR(10)', "DEFAULT 'P', CHECK IN ('P','C13','C16','C18')", 'Nhãn độ tuổi'],
    ['10', 'status', 'VARCHAR(20)', "DEFAULT 'upcoming', CHECK IN ('upcoming','showing','ended')", 'Trạng thái phim'],
    ['11', 'created_at / updated_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm tạo/cập nhật'],
  ],
  [500, 1800, 1600, 2900, 2271],
));
add(caption('Bảng 3.3: ROOMS – phòng chiếu'));
add(table(
  ['STT', 'Tên cột', 'Kiểu dữ liệu', 'Ràng buộc', 'Mô tả'],
  [
    ['1', 'room_id', 'BIGSERIAL', 'PRIMARY KEY', 'Mã phòng, tự tăng'],
    ['2', 'cinema_name', 'VARCHAR(100)', "NOT NULL, DEFAULT 'CGV Cinema'", 'Tên rạp'],
    ['3', 'room_code', 'VARCHAR(50)', 'NOT NULL', 'Mã phòng (vd: R1, R2)'],
    ['4', 'room_name', 'VARCHAR(100)', '', 'Tên phòng hiển thị'],
    ['5', 'total_seats', 'INTEGER', 'NOT NULL, DEFAULT 48, CHECK (> 0)', 'Tổng số ghế của phòng'],
    ['6', 'created_at / updated_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm tạo/cập nhật'],
    ['7', '(UNIQUE)', '(cinema_name, room_code)', 'UNIQUE', 'Một rạp không có hai phòng trùng mã'],
  ],
  [500, 1800, 1600, 2900, 2271],
));
add(caption('Bảng 3.4: SHOWTIMES – suất chiếu'));
add(table(
  ['STT', 'Tên cột', 'Kiểu dữ liệu', 'Ràng buộc', 'Mô tả'],
  [
    ['1', 'showtime_id', 'BIGSERIAL', 'PRIMARY KEY', 'Mã suất chiếu, tự tăng'],
    ['2', 'movie_id', 'BIGINT', 'NOT NULL, FK → movies(movie_id) ON DELETE CASCADE', 'Phim của suất chiếu'],
    ['3', 'room_id', 'BIGINT', 'NOT NULL, FK → rooms(room_id)', 'Phòng chiếu'],
    ['4', 'start_time', 'TIMESTAMPTZ', 'NOT NULL', 'Giờ bắt đầu'],
    ['5', 'end_time', 'TIMESTAMPTZ', 'NOT NULL, CHECK (> start_time)', 'Giờ kết thúc (tự tính theo duration)'],
    ['6', 'format', 'VARCHAR(10)', "DEFAULT '2D'", 'Định dạng: 2D/3D/IMAX'],
    ['7', 'price', 'NUMERIC(12,2)', 'NOT NULL, DEFAULT 0, CHECK (>= 0)', 'Giá vé một ghế'],
    ['8', 'available_seats', 'INTEGER', 'NOT NULL, DEFAULT 0, CHECK (>= 0)', 'Số ghế còn trống'],
    ['9', 'status', 'VARCHAR(20)', "DEFAULT 'available', CHECK IN ('available','cancelled','completed')", 'Trạng thái suất chiếu'],
    ['10', 'created_at / updated_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm tạo/cập nhật'],
    ['11', '(UNIQUE)', '(room_id, start_time)', 'UNIQUE', 'Một phòng không chiếu hai suất cùng giờ'],
  ],
  [500, 1800, 1600, 2900, 2271],
));
add(caption('Bảng 3.5: BOOKINGS – đơn đặt vé (hoá đơn vé)'));
add(table(
  ['STT', 'Tên cột', 'Kiểu dữ liệu', 'Ràng buộc', 'Mô tả'],
  [
    ['1', 'booking_id', 'BIGSERIAL', 'PRIMARY KEY', 'Mã đơn vé, tự tăng'],
    ['2', 'user_id', 'BIGINT', 'NOT NULL, FK → users(user_id) ON DELETE CASCADE', 'Khách hàng đặt vé'],
    ['3', 'showtime_id', 'BIGINT', 'NOT NULL, FK → showtimes(showtime_id) ON DELETE CASCADE', 'Suất chiếu được đặt'],
    ['4', 'booking_code', 'VARCHAR(32)', 'NOT NULL, UNIQUE', 'Mã vé duy nhất (12 ký tự hex hoa) – in trên vé'],
    ['5', 'seat_numbers', 'TEXT[]', "NOT NULL, DEFAULT '{}'", 'Mảng ghế (vd: {A1,A2,B3})'],
    ['6', 'total_price', 'NUMERIC(12,2)', 'NOT NULL, DEFAULT 0, CHECK (>= 0)', 'Tổng tiền = price × số ghế'],
    ['7', 'status', 'VARCHAR(20)', "DEFAULT 'pending', CHECK IN ('pending','confirmed','cancelled','completed')", 'Trạng thái đơn vé'],
    ['8', 'booked_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm đặt vé'],
    ['9', 'updated_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm cập nhật'],
  ],
  [500, 1800, 1600, 2900, 2271],
));
add(caption('Bảng 3.6: PAYMENTS – giao dịch thanh toán (thiết kế mở rộng)'));
add(table(
  ['STT', 'Tên cột', 'Kiểu dữ liệu', 'Ràng buộc', 'Mô tả'],
  [
    ['1', 'payment_id', 'BIGSERIAL', 'PRIMARY KEY', 'Mã giao dịch, tự tăng'],
    ['2', 'booking_id', 'BIGINT', 'NOT NULL, UNIQUE, FK → bookings(booking_id) ON DELETE CASCADE', 'Đơn vé liên quan (1 – 0..1)'],
    ['3', 'method', 'VARCHAR(20)', "CHECK IN ('cod','momo','zalopay','vnpay','bank')", 'Phương thức thanh toán'],
    ['4', 'amount', 'NUMERIC(12,2)', 'NOT NULL, CHECK (>= 0)', 'Số tiền thanh toán'],
    ['5', 'status', 'VARCHAR(20)', "DEFAULT 'pending', CHECK IN ('pending','paid','failed','refunded')", 'Trạng thái thanh toán'],
    ['6', 'transaction_ref', 'VARCHAR(64)', '', 'Mã tham chiếu từ cổng thanh toán'],
    ['7', 'paid_at', 'TIMESTAMPTZ', '', 'Thời điểm thanh toán thành công'],
    ['8', 'created_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm tạo giao dịch'],
  ],
  [500, 1800, 1600, 2900, 2271],
));
add(h2('3.4. Ràng buộc toàn vẹn và chỉ mục'));
add(p('Ràng buộc toàn vẹn:'));
add(bullet('Toàn vẹn thực thể: mọi bảng có khoá chính BIGSERIAL NOT NULL; email, booking_code, (cinema_name, room_code), (room_id, start_time) đều có UNIQUE.'));
add(bullet('Toàn vẹn tham chiếu: bookings.user_id → users.user_id, bookings.showtime_id → showtimes.showtime_id, showtimes.movie_id → movies.movie_id, showtimes.room_id → rooms.room_id, payments.booking_id → bookings.booking_id; hành vi ON DELETE CASCADE đảm bảo xoá sạch dữ liệu liên quan.'));
add(bullet('Toàn vẹn miền: CHECK ràng buộc status/role/age_rating/price/available_seats/duration_minutes/end_time > start_time.'));
add(bullet('Toàn vẹn nghiệp vụ (transaction): đặt vé thực hiện trong BEGIN – COMMIT/ROLLBACK kết hợp SELECT ... FOR UPDATE, đảm bảo available_seats không bao giờ âm và không bán trùng ghế.'));
add(p('Chỉ mục (index) đề xuất:'));
add(caption('Bảng 3.7: Chỉ mục tối ưu truy vấn'));
add(table(
  ['Bảng', 'Cột index', 'Mục đích'],
  [
    ['users', 'email (UNIQUE)', 'Tra cứu đăng nhập theo email – O(log n)'],
    ['movies', 'title, genre, status', 'Tìm kiếm và lọc danh sách phim'],
    ['showtimes', 'movie_id, start_time', 'Tra cứu lịch chiếu theo phim và ngày'],
    ['showtimes', 'room_id, start_time (UNIQUE)', 'Chống trùng suất trong phòng'],
    ['bookings', 'user_id, booked_at DESC', 'Lịch sử đặt vé của một user, mới nhất lên đầu'],
    ['bookings', 'showtime_id', 'Kiểm tra ghế đã đặt của một suất chiếu'],
    ['bookings', 'booking_code (UNIQUE)', 'Tra cứu vé theo mã vé'],
  ],
  [1900, 2900, 4271],
));
add(h2('3.5. Script DDL hoàn chỉnh'));
add(p('Script SQL dưới đây tạo toàn bộ 06 bảng với đầy đủ ràng buộc; có thể lưu thành schema.sql để server tự động khởi tạo khi chạy (dùng IF NOT EXISTS để chạy lại an toàn):'));
add(codeBlock([
  '-- ============ PHAN 3: THIET KE CSDL MOVIETICKET2 ============',
  '',
  'CREATE TABLE IF NOT EXISTS users (',
  '  user_id       BIGSERIAL PRIMARY KEY,',
  '  full_name     VARCHAR(100) NOT NULL,',
  '  email         VARCHAR(255) NOT NULL UNIQUE,',
  '  password_hash VARCHAR(255) NOT NULL,',
  '  phone         VARCHAR(20),',
  '  avatar_url    VARCHAR(255),',
  '  role          VARCHAR(20)  NOT NULL DEFAULT \'customer\'',
  '                CHECK (role IN (\'customer\', \'admin\')),',
  '  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,',
  '  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),',
  '  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()',
  ');',
  '',
  'CREATE TABLE IF NOT EXISTS movies (',
  '  movie_id          BIGSERIAL PRIMARY KEY,',
  '  title             VARCHAR(255) NOT NULL,',
  '  description       TEXT,',
  '  duration_minutes  INTEGER      NOT NULL CHECK (duration_minutes > 0),',
  '  genre             VARCHAR(100),',
  '  release_date      DATE,',
  '  poster_url        VARCHAR(255),',
  '  trailer_url       VARCHAR(255),',
  '  age_rating        VARCHAR(10)  NOT NULL DEFAULT \'P\'',
  '                    CHECK (age_rating IN (\'P\',\'C13\',\'C16\',\'C18\')),',
  '  status            VARCHAR(20)  NOT NULL DEFAULT \'upcoming\'',
  '                    CHECK (status IN (\'upcoming\',\'showing\',\'ended\')),',
  '  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),',
  '  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()',
  ');',
  '',
  'CREATE TABLE IF NOT EXISTS rooms (',
  '  room_id       BIGSERIAL PRIMARY KEY,',
  '  cinema_name   VARCHAR(100) NOT NULL DEFAULT \'CGV Cinema\',',
  '  room_code     VARCHAR(50)  NOT NULL,',
  '  room_name     VARCHAR(100),',
  '  total_seats   INTEGER      NOT NULL DEFAULT 48 CHECK (total_seats > 0),',
  '  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),',
  '  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),',
  '  UNIQUE (cinema_name, room_code)',
  ');',
  '',
  'CREATE TABLE IF NOT EXISTS showtimes (',
  '  showtime_id     BIGSERIAL PRIMARY KEY,',
  '  movie_id        BIGINT NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,',
  '  room_id         BIGINT NOT NULL REFERENCES rooms(room_id),',
  '  start_time      TIMESTAMPTZ NOT NULL,',
  '  end_time        TIMESTAMPTZ NOT NULL CHECK (end_time > start_time),',
  '  format          VARCHAR(10) NOT NULL DEFAULT \'2D\',',
  '  price           NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (price >= 0),',
  '  available_seats INTEGER NOT NULL DEFAULT 0 CHECK (available_seats >= 0),',
  '  status          VARCHAR(20) NOT NULL DEFAULT \'available\'',
  '                  CHECK (status IN (\'available\',\'cancelled\',\'completed\')),',
  '  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),',
  '  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),',
  '  UNIQUE (room_id, start_time)',
  ');',
  '',
  'CREATE TABLE IF NOT EXISTS bookings (',
  '  booking_id    BIGSERIAL PRIMARY KEY,',
  '  user_id       BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,',
  '  showtime_id   BIGINT NOT NULL REFERENCES showtimes(showtime_id) ON DELETE CASCADE,',
  '  booking_code  VARCHAR(32) NOT NULL UNIQUE,',
  '  seat_numbers  TEXT[] NOT NULL DEFAULT \'{}\'::TEXT[],',
  '  total_price   NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),',
  '  status        VARCHAR(20) NOT NULL DEFAULT \'pending\'',
  '                CHECK (status IN (\'pending\',\'confirmed\',\'cancelled\',\'completed\')),',
  '  booked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),',
  '  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()',
  ');',
  '',
  'CREATE TABLE IF NOT EXISTS payments (',
  '  payment_id      BIGSERIAL PRIMARY KEY,',
  '  booking_id      BIGINT NOT NULL UNIQUE',
  '                  REFERENCES bookings(booking_id) ON DELETE CASCADE,',
  '  method          VARCHAR(20) CHECK (method IN (\'cod\',\'momo\',\'zalopay\',\'vnpay\',\'bank\')),',
  '  amount          NUMERIC(12,2) NOT NULL CHECK (amount >= 0),',
  '  status          VARCHAR(20) NOT NULL DEFAULT \'pending\'',
  '                  CHECK (status IN (\'pending\',\'paid\',\'failed\',\'refunded\')),',
  '  transaction_ref VARCHAR(64),',
  '  paid_at         TIMESTAMPTZ,',
  '  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()',
  ');',
  '',
  '-- Chi muc de xuat tim kiem',
  'CREATE INDEX IF NOT EXISTS idx_movies_title  ON movies(title);',
  'CREATE INDEX IF NOT EXISTS idx_movies_filter ON movies(status, genre);',
  'CREATE INDEX IF NOT EXISTS idx_showtimes_movie_time ON showtimes(movie_id, start_time);',
  'CREATE INDEX IF NOT EXISTS idx_bookings_user_time ON bookings(user_id, booked_at DESC);',
  'CREATE INDEX IF NOT EXISTS idx_bookings_showtime  ON bookings(showtime_id);',
], 'Mã nguồn 3.1: Script DDL hoàn chỉnh – 06 bảng + chỉ mục'));
add(h2('3.6. Ánh xạ thiết kế với mã nguồn hiện tại'));
add(p('Bảng đối chiếu giữa thiết kế mục tiêu và schema.sql đang triển khai trong project:'));
add(caption('Bảng 3.8: Ánh xạ thiết kế – triển khai'));
add(table(
  ['Bảng thiết kế', 'Trạng thái', 'Ghi chú'],
  [
    ['users', 'Đã triển khai (cột id)', 'Thiết kế bổ sung avatar_url, is_active; đổi id → user_id'],
    ['movies', 'Đã triển khai', 'Thiết kế bổ sung trailer_url, age_rating (frontend đã hiển thị nhãn P/C13/C16/C18)'],
    ['rooms', 'Mới – chuẩn hoá', 'Hiện tại room/cinema_name là cột text trong showtimes; tách thành bảng rooms để quản lý tổng ghế và tránh dư thừa'],
    ['showtimes', 'Đã triển khai', 'Thiết kế đổi room → room_id (FK), thêm age_rating handling ở movies'],
    ['bookings', 'Đã triển khai', 'Giữ nguyên cấu trúc (mã vé, mảng ghế, tổng tiền, trạng thái)'],
    ['payments', 'Mới – mở rộng', 'Phục vụ use case UC12 thanh toán trực tuyến, chuẩn bị cho giai đoạn sau'],
  ],
  [1900, 1900, 5271],
));
add(pageBreak());

/* ===== Ket luan ===== */
add(h1('KẾT LUẬN'));
add(p('Tài liệu này đã hoàn thành ba nội dung yêu cầu của đồ án: (1) phân tích yêu cầu website theo tám nhóm chức năng và sáu nhóm phi chức năng, gắn với ba diễn viên khách hàng – quản trị viên – khách vãng lai; (2) thiết kế 13 use case với sơ đồ dạng ký hiệu và dạng Mermaid, các mối quan hệ include/extend, cùng mô tả chi tiết luồng của bốn use case nghiệp vụ chính; (3) thiết kế cơ sở dữ liệu gồm 06 bảng chi tiết (users, movies, rooms, showtimes, bookings, payments) đạt chuẩn 3NF, với từ điển dữ liệu đầy đủ kiểu dữ liệu – ràng buộc – mô tả, sơ đồ ERD, ràng buộc toàn vẹn, chỉ mục tối ưu và script DDL hoàn chỉnh có thể chạy trực tiếp trên PostgreSQL.'));
add(p('Thiết kế đáp ứng yêu cầu "tối thiểu 03 bảng" với 06 bảng, trong đó bốn bảng (users, movies, showtimes, bookings) đã được hiện thực trong mã nguồn hiện tại, hai bảng (rooms, payments) là thiết kế mở rộng phục vụ chuẩn hoá dữ liệu và thanh toán trực tuyến ở các giai đoạn sau.'));

/* ---------------- Build document ---------------- */
const bodyXml = B.join('');
const sectPr = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1701" w:left="1701" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr>';
const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${bodyXml}${sectPr}</w:body></w:document>`;

const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`;

const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;

const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/><w:lang w:val="vi-VN" w:bidi="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="312" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="table" w:default="1" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:uiPriority w:val="59"/><w:unhideWhenUsed/></w:style></w:styles>`;

/* ---------------- ZIP writer (stored) ---------------- */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i += 1) crc = CRC_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function buildZip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  files.forEach((f) => {
    const nameBuf = Buffer.from(f.name, 'utf8');
    const crc = crc32(f.data);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(0, 8);
    lh.writeUInt16LE(0, 10);
    lh.writeUInt16LE(0, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(f.data.length, 18);
    lh.writeUInt32LE(f.data.length, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    lh.writeUInt16LE(0, 28);
    chunks.push(lh, nameBuf, f.data);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(f.data.length, 20);
    cd.writeUInt32LE(f.data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(offset, 42);
    central.push(cd, nameBuf);
    offset += 30 + nameBuf.length + f.data.length;
  });
  const centralSize = central.reduce((s, c) => s + c.length, 0);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);
  return Buffer.concat([...chunks, ...central, eocd]);
}

const files = [
  { name: '[Content_Types].xml', data: Buffer.from(contentTypes, 'utf8') },
  { name: '_rels/.rels', data: Buffer.from(rootRels, 'utf8') },
  { name: 'word/document.xml', data: Buffer.from(documentXml, 'utf8') },
  { name: 'word/_rels/document.xml.rels', data: Buffer.from(docRels, 'utf8') },
  { name: 'word/styles.xml', data: Buffer.from(stylesXml, 'utf8') },
];
const zipBuf = buildZip(files);

const out = path.join(__dirname, 'Phan_tich_thiet_ke_MovieTicket2.docx');
fs.writeFileSync(out, zipBuf);
console.log(`Da tao: ${out} (${(zipBuf.length / 1024).toFixed(1)} KB)`);
