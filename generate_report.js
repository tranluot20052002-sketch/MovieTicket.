/* Generator: Bao cao do an MovieTicket2 (.docx) - pure Node.js, no dependencies */
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
const bullet = (text, level = 0) => para(run(text), { align: 'justify', indent: 480 + level * 360, hanging: 240 }).replace('<w:t xml:space="preserve">', '<w:t xml:space="preserve">• ');
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

function table(headers, rows, widths, opts = {}) {
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

/* ---------------- Report content ---------------- */
const B = [];
const add = (...items) => B.push(...items);

/* ===== Trang bìa ===== */
add(para('', { after: 2400 }));
add(center('TRƯỜNG ĐẠI HỌC ...............', { size: 13, after: 80 }));
add(center('KHOA ...............', { size: 13, after: 1600 }));
add(center('BÁO CÁO ĐỒ ÁN MÔN HỌC', { bold: true, size: 18, after: 120 }));
add(center('ĐỒ ÁN CƠ SỞ / ĐỒ ÁN MÔN HỌC', { bold: true, size: 14, after: 400 }));
add(center('ĐỀ TÀI:', { size: 13, after: 60 }));
add(center('XÂY DỰNG WEBSITE ĐẶT VÉ XEM PHIM TRỰC TUYẾN', { bold: true, size: 15, after: 60 }));
add(center('MovieTicket2', { bold: true, size: 17, color: '4941D6', after: 800 }));
add(center('Công nghệ: Node.js · Express · PostgreSQL · JavaScript SPA', { size: 12, after: 120 }));
add(center('Sinh viên: Họ và tên ...............', { size: 12, after: 60 }));
add(center('Lớp: ...............      MSSV: ...............', { size: 12, after: 60 }));
add(center('Giảng viên hướng dẫn: ...............', { size: 12, after: 60 }));
add(center('Ngày thực hiện: 13/10/2026', { size: 12, after: 60 }));
add(pageBreak());

/* ===== Mục lục ===== */
add(h1('MỤC LỤC'));
const toc = [
  ['Lời cảm ơn', ''],
  ['Danh mục từ viết tắt', ''],
  ['Mở đầu', ''],
  ['1. Lý do chọn đề tài', '   '],
  ['2. Mục tiêu đề tài', '   '],
  ['3. Đối tượng và phạm vi', '   '],
  ['4. Phương pháp thực hiện', '   '],
  ['5. Bố cục báo cáo', '   '],
  ['Chương 1: Tổng quan và cơ sở lý thuyết', ''],
  ['1.1. Tổng quan hệ thống MovieTicket2', '   '],
  ['1.2. Mô hình Client – Server', '   '],
  ['1.3. Kiến trúc RESTful API', '   '],
  ['1.4. Xác thực và phân quyền với JWT', '   '],
  ['1.5. Mã hóa mật khẩu với BCrypt', '   '],
  ['1.6. Hệ quản trị cơ sở dữ liệu PostgreSQL', '   '],
  ['1.7. Công nghệ frontend ứng dụng trang đơn (SPA)', '   '],
  ['1.8. Bảng công nghệ sử dụng', '   '],
  ['Chương 2: Phân tích và thiết kế hệ thống', ''],
  ['2.1. Yêu cầu chức năng', '   '],
  ['2.2. Yêu cầu phi chức năng', '   '],
  ['2.3. Phân tích vai trò và phân quyền', '   '],
  ['2.4. Thiết kế cơ sở dữ liệu', '   '],
  ['2.5. Thiết kế luồng nghiệp vụ', '   '],
  ['2.6. Thiết kế giao diện người dùng', '   '],
  ['Chương 3: Xây dựng và hiện thực hệ thống', ''],
  ['3.1. Môi trường phát triển', '   '],
  ['3.2. Cấu trúc thư mục dự án', '   '],
  ['3.3. Cấu hình và khởi chạy hệ thống', '   '],
  ['3.4. Tầng kết nối cơ sở dữ liệu', '   '],
  ['3.5. Middleware xác thực JWT', '   '],
  ['3.6. Module xác thực người dùng', '   '],
  ['3.7. Module quản lý phim', '   '],
  ['3.8. Module đặt vé', '   '],
  ['3.9. Module quản lý suất chiếu', '   '],
  ['3.10. Module liên hệ', '   '],
  ['3.11. Danh mục API endpoints', '   '],
  ['3.12. Frontend ứng dụng trang đơn', '   '],
  ['3.13. Giao diện và định dạng CSS', '   '],
  ['Chương 4: Kiểm thử và kết quả', ''],
  ['4.1. Môi trường và phương pháp kiểm thử', '   '],
  ['4.2. Kiểm thử xác thực người dùng', '   '],
  ['4.3. Kiểm thử quản lý phim', '   '],
  ['4.4. Kiểm thử đặt vé', '   '],
  ['4.5. Kiểm thử giao diện', '   '],
  ['4.6. Đánh giá kết quả kiểm thử', '   '],
  ['Kết luận', ''],
  ['Tài liệu tham khảo', ''],
];
toc.forEach(([t, pre]) => add(para(run(pre + t), { align: 'left', after: 20 })));
add(pageBreak());

/* ===== Lời cảm ơn ===== */
add(h1('LỜI CẢM ƠN'));
add(p('Em xin gửi lời cảm ơn chân thành đến các thầy cô trong bộ môn đã tận tình hướng dẫn, truyền đạt những kiến thức quý báu để em có thể hoàn thành tốt đồ án cơ sở này. Đặc biệt, em xin cảm ơn giảng viên hướng dẫn đã định hướng đề tài, góp ý về kiến trúc hệ thống và cách triển khai để đồ án ngày càng hoàn thiện.'));
add(p('Em cũng xin cảm ơn các bạn bè, người thân đã luôn động viên, hỗ trợ em trong quá trình tìm hiểu công nghệ, xây dựng và kiểm thử hệ thống. Những kiến thức về Node.js, Express, PostgreSQL, JWT và bcrypt được em tự nghiên cứu và áp dụng trực tiếp vào đồ án, giúp em hiểu sâu hơn về quy trình phát triển một ứng dụng web thực tế.'));
add(p('Do thời gian và kinh nghiệm còn hạn chế, đồ án chắc chắn không tránh khỏi những thiếu sót. Em rất mong nhận được sự góp ý của thầy cô để hoàn thiện hơn nữa.'));
add(pageBreak());

/* ===== Danh mục từ viết tắt ===== */
add(h1('DANH MỤC TỪ VIẾT TẮT'));
add(table(
  ['Từ viết tắt', 'Ý nghĩa', 'Từ viết tắt', 'Ý nghĩa'],
  [
    ['API', 'Application Programming Interface', 'JWT', 'JSON Web Token'],
    ['BCrypt', 'Blowfish-based password hashing', 'JSON', 'JavaScript Object Notation'],
    ['CRUD', 'Create – Read – Update – Delete', 'MVC', 'Model – View – Controller'],
    ['CSS', 'Cascading Style Sheets', 'REST', 'Representational State Transfer'],
    ['DDL', 'Data Definition Language', 'SPA', 'Single Page Application'],
    ['ERD', 'Entity – Relationship Diagram', 'SQL', 'Structured Query Language'],
    ['FK', 'Foreign Key (khóa ngoại)', 'SVG', 'Scalable Vector Graphics'],
    ['HTTP', 'HyperText Transfer Protocol', 'UI/UX', 'User Interface / User Experience'],
  ],
  [1050, 3486, 1050, 3485],
));
add(pageBreak());

/* ===== Mở đầu ===== */
add(h1('MỞ ĐẦU'));
add(h2('1. Lý do chọn đề tài'));
add(p('Trong bối cảnh công nghệ thông tin phát triển mạnh mẽ, việc số hóa các dịch vụ giải trí là xu thế tất yếu. Rạp chiếu phim truyền thống thường yêu cầu khán giả đến trực tiếp quầy vé để mua vé, dẫn đến tình trạng xếp hàng dài, hết vé suất chiếu hot và khó quản lý doanh thu. Đặt vé xem phim trực tuyến giải quyết những vấn đề trên bằng cách cho phép người dùng tra cứu phim, xem lịch chiếu, chọn ghế và nhận vé điện tử mọi lúc, mọi nơi chỉ qua trình duyệt web.'));
add(p('Bên cạnh đó, đồ án là cơ hội để em vận dụng tổng hợp kiến thức đã học: lập trình phía máy chủ với Node.js và Express, thiết kế cơ sở dữ liệu quan hệ với PostgreSQL, xác thực bảo mật với JWT và bcrypt, cùng kỹ năng xây dựng giao diện web hiện đại bằng HTML, CSS và JavaScript thuần. Vì vậy, em chọn đề tài "Xây dựng website đặt vé xem phim trực tuyến – MovieTicket2" làm đồ án môn học của mình.'));
add(h2('2. Mục tiêu đề tài'));
add(p('Đề tài hướng đến các mục tiêu cụ thể sau:'));
add(numbered(1, 'Xây dựng website đặt vé xem phim hoàn chỉnh với các chức năng: đăng ký – đăng nhập tài khoản, quản lý phim, xem danh sách và chi tiết phim, đặt vé theo suất chiếu, và theo dõi lịch sử đặt vé.'));
add(numbered(2, 'Xây dựng hệ thống RESTful API phía máy chủ bằng Node.js và Express, kết nối cơ sở dữ liệu PostgreSQL với cấu trúc bảng chuẩn hóa.'));
add(numbered(3, 'Đảm bảo an toàn thông tin: mã hóa mật khẩu bằng bcrypt, xác thực người dùng bằng JWT và phân quyền giữa khách hàng (customer) với quản trị viên (admin).'));
add(numbered(4, 'Đảm bảo toàn vẹn dữ liệu khi đặt vé bằng transaction và khóa hàng (SELECT ... FOR UPDATE), chống đặt trùng ghế và hết vé vượt quá số ghế khả dụng.'));
add(numbered(5, 'Xây dựng giao diện Single Page Application (SPA) thân thiện, hiển thị tốt trên nhiều thiết bị, tích hợp vé điện tử có mã vạch SVG kèm chức năng in vé và tải vé.'));
add(h2('3. Đối tượng và phạm vi'));
add(p('Đối tượng sử dụng hệ thống gồm hai nhóm: khách hàng (customer) – người xem phim cần tra cứu và đặt vé; và quản trị viên (admin) – người quản lý danh mục phim trong hệ thống.'));
add(p('Phạm vi thực hiện của đồ án bao gồm: module xác thực người dùng (đăng ký, đăng nhập, token), module quản lý phim (danh sách, chi tiết, thêm, xóa), module đặt vé (chọn suất, chọn ghế 1–10 ghế, tạo mã vé, tính tổng tiền, cập nhật số ghế trống) và module lịch sử đặt vé kèm vé điện tử. Các chức năng như thanh toán trực tuyến, quản lý suất chiếu/ghế từ phía admin, gửi email xác nhận nằm ngoài phạm vi đồ án và được đề xuất ở phần hướng phát triển.'));
add(h2('4. Phương pháp thực hiện'));
add(numbered(1, 'Phân tích yêu cầu: xác định các chức năng theo hai vai trò khách hàng và quản trị viên, từ đó xây dựng danh sách yêu cầu chức năng và phi chức năng.'));
add(numbered(2, 'Thiết kế: vẽ sơ đồ thực thể – liên kết (ERD), định nghĩa các bảng dữ liệu với ràng buộc toàn vẹn, thiết kế luồng nghiệp vụ đặt vé và thiết kế giao diện.'));
add(numbered(3, 'Triển khai: chia hệ thống thành các module (config, middleware, routes, controllers, public) và phát triển tăng dần từng phần, kết hợp giao diện SPA gọi API qua fetch.'));
add(numbered(4, 'Kiểm thử: kiểm thử từng endpoint API bằng Postman và qua giao diện, kiểm thử các trường hợp lỗi (email trùng, mật khẩu yếu, thiếu token, ghế trùng, hết vé) và kiểm thử đồng thời hai client đặt cùng một ghế.'));
add(h2('5. Bố cục báo cáo'));
add(p('Báo cáo gồm phần mở đầu, bốn chương và phần kết luận. Chương 1 trình bày tổng quan và cơ sở lý thuyết; Chương 2 phân tích và thiết kế hệ thống; Chương 3 mô tả quá trình xây dựng và hiện thực mã nguồn; Chương 4 trình bày kết quả kiểm thử; cuối cùng là kết luận và tài liệu tham khảo.'));
add(pageBreak());

/* ===== Chuong 1 ===== */
add(h1('CHƯƠNG 1: TỔNG QUAN VÀ CƠ SỞ LÝ THUYẾT'));
add(h2('1.1. Tổng quan hệ thống MovieTicket2'));
add(p('MovieTicket2 là hệ thống đặt vé xem phim trực tuyến được phát triển theo mô hình ứng dụng trang đơn (SPA) kết hợp với máy chủ REST API. Hệ thống gồm năm trang: Trang chủ (giới thiệu và đăng nhập/đăng ký), Danh sách phim (quản lý và xem thông tin phim), Lịch chiếu (chọn ngày, xem suất chiếu, chọn ghế và quản lý suất chiếu cho admin), Vé của tôi (đặt vé, lịch sử đặt vé và vé điện tử) và Liên hệ (thông tin rạp, gửi phản hồi và quản lý tin nhắn cho admin).'));
add(p('Hệ thống phân biệt hai vai trò: khách hàng được đăng ký, đăng nhập, đặt vé và xem lịch sử; quản trị viên ngoài các quyền của khách hàng còn có thể xóa phim (kèm toàn bộ suất chiếu của phim đó). Mọi dữ liệu được lưu trữ tập trung trên PostgreSQL, giao tiếp giữa client và server hoàn toàn qua JSON.'));
add(h2('1.2. Mô hình Client – Server'));
add(p('Ứng dụng phát triển theo mô hình Client – Server, trong đó phía Client là trình duyệt web chạy mã HTML, CSS, JavaScript (file public/index.html, public/app.js, public/styles.css); phía Server là chương trình Node.js sử dụng framework Express (server.js) tiếp nhận yêu cầu HTTP, xử lý logic nghiệp vụ và truy vấn cơ sở dữ liệu.'));
add(p('Mô hình này có nhiều ưu điểm phù hợp với đồ án: tách biệt rõ ràng giữa giao diện và xử lý logic, dễ mở rộng và bảo trì; phía client không cần cài đặt gì thêm ngoài trình duyệt; phía server có thể phục vụ đồng thời nhiều client. Vì mỗi yêu cầu đã chứa đầy đủ thôngện (token trong header Authorization), server hoạt động theo nguyên tắc stateless – không lưu trạng thái phiên trên bộ nhớ, giúp hệ thống dễ mở rộng theo chiều ngang.'));
add(h2('1.3. Kiến trúc RESTful API'));
add(p('Server cung cấp các endpoint theo kiến trúc RESTful (Representational State Transfer), trong đó mỗi tài nguyên (users, movies, bookings) được biểu diễn bằng một URL thuộc dạng /api/<tài-nguyên>, và các thao tác được biểu diễn bằng phương thức HTTP: GET để đọc dữ liệu, POST để tạo mới, DELETE để xóa.'));
add(p('API sử dụng mã trạng thái HTTP để thông báo kết quả một cách rõ ràng: 200 (thành công), 201 (tạo mới thành công), 400 (dữ liệu đầu vào không hợp lệ), 401 (chưa xác thực – thiếu token), 403 (không có quyền hoặc token không hợp lệ), 404 (không tìm thấy tài nguyên), 409 (xung đột nghiệp vụ như email đã tồn tại, ghế đã được đặt), 500 (lỗi nội bộ server). Mọi dữ liệu trao đổi đều ở định dạng JSON, dễ đọc cho cả con người và máy tính, đồng thời tương thích tốt với frontend JavaScript.'));
add(h2('1.4. Xác thực và phân quyền với JWT'));
add(p('Hệ thống sử dụng JSON Web Token (JWT, theo chuẩn RFC 7519) để xác thực người dùng. Sau khi đăng ký hoặc đăng nhập thành công, server tạo token bằng hàm jwt.sign() với payload chứa userId và role của người dùng, ký bằng khóa bí mật JWT_SECRET trong file .env và đặt thời hạn hiệu lực (mặc định 1 giờ). Token được trả về client và lưu trong localStorage.'));
add(p('Với các yêu cầu cần đăng nhập, client gửi token trong header Authorization theo định dạng "Bearer <token>". Middleware authenticateToken trích xuất token, kiểm tra tính hợp lệ bằng jwt.verify(): nếu thiếu token trả về 401, nếu token sai hoặc hết hạn trả về 403, nếu hợp lệ sẽ gắn thông tin người dùng vào req.user để các bước xử lý tiếp theo sử dụng. Phân quyền quản trị (requireAdmin) dựa vào trường role trong payload: chỉ những user có role = "admin" mới được phép xóa phim, các yêu cầu khác bị từ chối với mã 403. Đây là mô hình phân quyền đơn giản theo vai trò (RBAC).'));
add(h2('1.5. Mã hóa mật khẩu với BCrypt'));
add(p('Bảo mật mật khẩu là yêu cầu bắt buộc: hệ thống không bao giờ lưu mật khẩu dạng gốc (plaintext). Khi đăng ký, mật khẩu được băm một chiều bằng thư viện bcryptjs với hệ số salt rounds bằng 10 (bcrypt.hash(password, 10)), tạo ra chuỗi password_hash chứa cả salt và hash, sau đó lưu vào cột password_hash. Khi đăng nhập, server không giải mã (vì bcrypt là hàm một chiều) mà dùng bcrypt.compare() để so sánh mật khẩu nhập vào với giá trị hash đã lưu – bcrypt tự động trích xuất salt trong hash để tính lại và so sánh.'));
add(p('BCrypt được thiết kế cố ý chạy chậm (tốn tài nguyên tính toán), do đó ngay cả khi cơ sở dữ liệu bị lộ, kẻ tấn công cũng rất khó dò mật khẩu bằng phương pháp brute-force hay bảng rainbow. Ngoài ra, khi trả dữ liệu user ra client, hệ thống luôn xóa trường password_hash (delete user.password_hash) để không lộ thông tin nhạy cảm.'));
add(h2('1.6. Hệ quản trị cơ sở dữ liệu PostgreSQL'));
add(p('PostgreSQL được chọn làm hệ quản trị cơ sở dữ liệu vì là hệ CSDL quan hệ mã nguồn mở, mạnh mẽ, tuân thủ chuẩn SQL và hỗ trợ nhiều tính năng cần thiết cho đồ án:'));
add(bullet('Ràng buộc toàn vẹn: khóa chính BIGSERIAL, khóa ngoại REFERENCES ... ON DELETE CASCADE, ràng buộc CHECK (giới hạn giá trị enum như role, status), ràng buộc UNIQUE (email, booking_code, cặp phòng – giờ chiếu).'));
add(bullet('Transaction ACID: các thao tác đặt vé và xóa phim được thực hiện trong transaction BEGIN/COMMIT/ROLLBACK, đảm bảo dữ liệu luôn nhất quán kể cả khi có lỗi xảy ra giữa chừng.'));
add(bullet('Khóa hàng SELECT ... FOR UPDATE: khóa bản ghi suất chiếu trong suốt transaction, ngăn hai người dùng đặt cùng một ghế đồng thời (chống overbooking).'));
add(bullet('Kiểu dữ liệu phong phú: TIMESTAMPTZ (thời gian có múi giờ), NUMERIC(12,2) (giá tiền chính xác), TEXT[] (mảng danh sách ghế).'));
add(h2('1.7. Công nghệ frontend ứng dụng trang đơn (SPA)'));
add(p('Phía giao diện được xây dựng dưới dạng ứng dụng trang đơn: toàn bộ nội dung nằm trong một file index.html, các phần nội dung (view) được ẩn/hiện bằng JavaScript mà không cần tải lại trang. Người dùng di chuyển giữa bốn mục Trang chủ – Danh sách phim – Lịch chiếu – Vé của tôi thông qua hàm switchSection(). Các công nghệ chính được sử dụng:'));
add(bullet('Fetch API để gọi REST API không đồng bộ (async/await), tự động đính kèm token trong header Authorization.'));
add(bullet('localStorage để lưu token và thông tin user (hai khóa movieTicketToken, movieTicketUser), giúp duy trì trạng thái đăng nhập khi tải lại trang.'));
add(bullet('Intl.NumberFormat và Intl.DateTimeFormat với locale "vi-VN" để định dạng tiền tệ (VND) và ngày giờ theo chuẩn Việt Nam.'));
add(bullet('DOM API để tạo giao diện động: danh sách phim, thẻ ngày chiếu, lưới ghế ngồi, danh sách lịch sử vé, hộp thoại modal và thông báo toast.'));
add(bullet('SVG để sinh mã vạch vé, Blob và URL.createObjectURL để tải vé về dạng file HTML, và window.print() để in vé.'));
add(h2('1.8. Bảng công nghệ sử dụng'));
add(caption('Bảng 1.1: Công nghệ và vai trò trong hệ thống'));
add(table(
  ['Công nghệ', 'Phiên bản', 'Vai trò trong hệ thống'],
  [
    ['Node.js', 'Runtime', 'Môi trường chạy phía máy chủ'],
    ['Express.js', '5.2.1', 'Web framework, định tuyến HTTP, middleware'],
    ['pg (node-postgres)', '8.23.0', 'Kết nối PostgreSQL, quản lý connection pool'],
    ['bcryptjs', '3.0.3', 'Băm và so sánh mật khẩu an toàn'],
    ['jsonwebtoken', '9.0.3', 'Tạo và xác thực JWT'],
    ['dotenv', '17.4.2', 'Nạp cấu hình từ file .env'],
    ['cors', '2.8.6', 'Hỗ trợ chia sẻ tài nguyên liên miền (khai báo)'],
    ['nodemon', '3.1.14', 'Tự động khởi động lại server khi sửa code (dev)'],
    ['PostgreSQL', '16', 'Hệ quản trị cơ sở dữ liệu chính'],
    ['HTML5 / CSS3 / JavaScript (ES6+)', '-', 'Giao diện SPA phía client'],
  ],
  [2600, 1300, 5171],
));
add(pageBreak());

/* ===== Chuong 2 ===== */
add(h1('CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG'));
add(h2('2.1. Yêu cầu chức năng'));
add(p('Dựa trên phân tích nghiệp vụ đặt vé phim, hệ thống cần đáp ứng các yêu cầu chức năng sau:'));
add(caption('Bảng 2.1: Yêu cầu chức năng của hệ thống'));
add(table(
  ['Mã', 'Yêu cầu chức năng', 'Mô tả chi tiết', 'Vai trò'],
  [
    ['F1', 'Đăng ký tài khoản', 'Nhập họ tên, email, mật khẩu (tối thiểu 6 ký tự), số điện thoại (tuỳ chọn); email phải đúng định dạng và không trùng lặp', 'Customer'],
    ['F2', 'Đăng nhập', 'Xác minh email – mật khẩu, trả về JWT và thông tin user', 'Customer'],
    ['F3', 'Xem danh sách phim', 'Hiển thị poster, tên, thể loại, thời lượng, trạng thái và giá vé từ (ghé nhất theo suất chiếu khả dụng); hỗ trợ lọc theo trạng thái và thể loại', 'Customer'],
    ['F4', 'Xem chi tiết phim', 'Hiển thị đầy đủ thông tin một phim trong hộp thoại modal', 'Customer'],
    ['F5', 'Thêm phim mới', 'Nhập tên, thời lượng, thể loại, ngày khởi chiếu, trạng thái, nhãn độ tuổi, mô tả, ảnh poster', 'Admin'],
    ['F6', 'Sửa phim', 'Cập nhật thông tin phim đã có (chỉnh form, lưu thay đổi)', 'Admin'],
    ['F7', 'Xóa phim', 'Xóa phim cùng toàn bộ suất chiếu trong một transaction; chỉ admin được phép', 'Admin'],
    ['F8', 'Đặt vé', 'Chọn suất chiếu, nhập 1–10 ghế, chống trùng ghế, tính tổng tiền, tạo mã vé, cập nhật số ghế trống', 'Customer'],
    ['F9', 'Lịch sử đặt vé', 'Xem danh sách vé đã đặt kèm thông tin phim, suất chiếu, ghế và tổng tiền', 'Customer'],
    ['F10', 'Vé điện tử', 'Hiển thị vé có mã vạch SVG, in vé và tải vé về máy', 'Customer'],
    ['F11', 'Quản lý suất chiếu', 'Thêm/sửa/xoá suất chiếu theo phim, phòng, ngày giờ, định dạng, giá vé, số ghế; chặn xoá suất đã có đơn vé', 'Admin'],
    ['F12', 'Liên hệ', 'Gửi phản hồi qua form (lưu vào CSDL); admin xem, đổi trạng thái (mới/đã đọc/hoàn tất) và xoá tin nhắn', 'Customer, Admin'],
    ['F13', 'Quản lý phiên', 'Đăng xuất, tự động đăng xuất khi token hết hạn (401)', 'Customer'],
  ],
  [700, 1800, 4871, 1700],
));
add(p('Bảng 2.1 thể hiện đầy đủ các chức năng thêm – sửa – xoá (CRUD) theo đúng yêu cầu đồ án: quản lý phim và suất chiếu (admin), đặt vé và liên hệ (khách hàng).'));
add(h2('2.2. Yêu cầu phi chức năng'));
add(caption('Bảng 2.2: Yêu cầu phi chức năng'));
add(table(
  ['STT', 'Yêu cầu', 'Mô tả'],
  [
    ['1', 'Hiệu năng', 'Phản hồi API nội bộ nhanh (dưới 300 ms cho thao tác đơn giản), sử dụng connection pool của pg để tái sử dụng kết nối'],
    ['2', 'Bảo mật', 'Mật khẩu băm bcrypt; truy vấn tham số hoá ($1, $2...) chống SQL injection; mã hoá HTML ở client (escapeHtml) chống XSS; không trả mật khẩu hash ra client; khoá bí mật nằm trong .env'],
    ['3', 'Toàn vẹn dữ liệu', 'Transaction ACID cho đặt vé và xoá phim; SELECT ... FOR UPDATE khoá hàng; ràng buộc CHECK/UNIQUE/FOREIGN KEY trên CSDL'],
    ['4', 'Khả dụng', 'Giao diện SPA không tải lại trang; hỗ trợ độ rộng màn hình từ 320 px; thông báo lỗi rõ ràng bằng tiếng Việt'],
    ['5', 'Khả năng bảo trì', 'Tách rõ tầng routes – controllers – middleware – config; code có cấu trúc, đặt tên nhất quán'],
  ],
  [700, 1900, 6471],
));
add(h2('2.3. Phân tích vai trò và phân quyền'));
add(p('Hệ thống định nghĩa hai vai trò trong cột role của bảng users (ràng buộc CHECK chỉ cho phép "customer" hoặc "admin"). Ma trận phân quyền như sau:'));
add(caption('Bảng 2.3: Ma trận phân quyền theo vai trò'));
add(table(
  ['Chức năng', 'Khách hàng (customer)', 'Quản trị viên (admin)'],
  [
    ['Đăng ký / đăng nhập / đăng xuất', '✓', '✓'],
    ['Xem danh sách phim, chi tiết phim', '✓', '✓'],
    ['Đặt vé, xem lịch sử, vé điện tử', '✓', '✓'],
    ['Gửi liên hệ (POST /api/contacts)', '✓', '✓'],
    ['Xem/quản lý tin nhắn liên hệ (GET/PUT/DELETE /api/contacts)', '✗', '✓'],
    ['Thêm/Sửa/Xoá phim (POST/PUT/DELETE /api/movies)', '✗ (403)', '✓'],
    ['Thêm/Sửa/Xoá suất chiếu (POST/PUT/DELETE /api/showtimes)', '✗ (403)', '✓'],
    ['Xoá phim (DELETE /api/movies/:id)', '✗ (403)', '✓ (requireAdmin)'],
  ],
  [4000, 2600, 2471],
));
add(h2('2.4. Thiết kế cơ sở dữ liệu'));
add(p('2.4.1. Sơ đồ thực thể – liên kết (ERD)'));
add(p('Cơ sở dữ liệu gồm bốn thực thể chính với các liên kết:'));
add(bullet('users (1) — (n) bookings: một người dùng có thể đặt nhiều vé; mỗi vé thuộc đúng một người dùng (user_id).'));
add(bullet('movies (1) — (n) showtimes: một phim có nhiều suất chiếu; xoá phim thì xoá luôn suất chiếu (ON DELETE CASCADE).'));
add(bullet('showtimes (1) — (n) bookings: một suất chiếu có nhiều vé; xoá suất chiếu thì xoá vé tương ứng.'));
add(p('Quan hệ giữa movies và users là quan hệ gián tiếp thông qua showtimes và bookings (movies → showtimes → bookings → users).'));
add(p('2.4.2. Chi tiết các bảng dữ liệu'));
add(caption('Bảng 2.4: Bảng users – tài khoản người dùng'));
add(table(
  ['Tên cột', 'Kiểu', 'Ràng buộc', 'Mô tả'],
  [
    ['id', 'BIGSERIAL', 'PRIMARY KEY', 'Mã người dùng tự tăng'],
    ['full_name', 'VARCHAR(255)', 'NOT NULL', 'Họ và tên'],
    ['email', 'VARCHAR(255)', 'NOT NULL, UNIQUE', 'Email đăng nhập (duy nhất)'],
    ['password_hash', 'VARCHAR(255)', 'NOT NULL', 'Mật khẩu đã băm bcrypt'],
    ['phone', 'VARCHAR(20)', '', 'Số điện thoại (tuỳ chọn)'],
    ['role', 'VARCHAR(20)', "DEFAULT 'customer', CHECK IN ('customer','admin')", 'Vai trò'],
    ['created_at / updated_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm tạo/cập nhật'],
  ],
  [1900, 1500, 2900, 2771],
));
add(caption('Bảng 2.5: Bảng movies – danh mục phim'));
add(table(
  ['Tên cột', 'Kiểu', 'Ràng buộc', 'Mô tả'],
  [
    ['id', 'BIGSERIAL', 'PRIMARY KEY', 'Mã phim'],
    ['title', 'VARCHAR(255)', 'NOT NULL', 'Tên phim'],
    ['description', 'TEXT', '', 'Mô tả phim'],
    ['duration_minutes', 'INTEGER', 'NOT NULL, CHECK > 0', 'Thời lượng (phút)'],
    ['genre', 'VARCHAR(100)', '', 'Thể loại'],
    ['release_date', 'DATE', '', 'Ngày khởi chiếu'],
    ['poster_url', 'TEXT', '', 'Đường dẫn ảnh poster'],
    ['age_rating', 'VARCHAR(10)', "DEFAULT 'P', CHECK IN ('P','C13','C16','C18')", 'Nhãn độ tuổi'],
    ['status', 'VARCHAR(20)', "DEFAULT 'upcoming', CHECK IN ('upcoming','showing','ended')", 'Trạng thái: sắp chiếu/đang chiếu/đã chiếu'],
    ['created_at / updated_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm tạo/cập nhật'],
  ],
  [1900, 1500, 2900, 2771],
));
add(caption('Bảng 2.6: Bảng showtimes – suất chiếu'));
add(table(
  ['Tên cột', 'Kiểu', 'Ràng buộc', 'Mô tả'],
  [
    ['id', 'BIGSERIAL', 'PRIMARY KEY', 'Mã suất chiếu'],
    ['movie_id', 'BIGINT', 'NOT NULL, FK → movies(id) ON DELETE CASCADE', 'Phim tương ứng'],
    ['start_time / end_time', 'TIMESTAMPTZ', 'NOT NULL, CHECK (end_time > start_time)', 'Giờ bắt đầu/kết thúc'],
    ['room', 'VARCHAR(50)', 'NOT NULL', 'Phòng chiếu'],
    ['cinema_name', 'VARCHAR(100)', "DEFAULT 'CGV Cinema'", 'Tên rạp'],
    ['format', 'VARCHAR(10)', "DEFAULT '2D'", 'Định dạng (2D/3D/IMAX...)'],
    ['price', 'NUMERIC(12,2)', 'NOT NULL, CHECK >= 0', 'Giá vé một ghế'],
    ['available_seats', 'INTEGER', 'NOT NULL, CHECK >= 0', 'Số ghế còn trống'],
    ['status', 'VARCHAR(20)', "DEFAULT 'available', CHECK IN ('available','cancelled','completed')", 'Trạng thái suất chiếu'],
    ['UNIQUE (room, start_time)', '-', 'UNIQUE', 'Một phòng không chiếu hai suất cùng giờ'],
  ],
  [1900, 1500, 2900, 2771],
));
add(caption('Bảng 2.7: Bảng bookings – đơn đặt vé'));
add(table(
  ['Tên cột', 'Kiểu', 'Ràng buộc', 'Mô tả'],
  [
    ['id', 'BIGSERIAL', 'PRIMARY KEY', 'Mã đơn vé'],
    ['user_id', 'BIGINT', 'NOT NULL, FK → users(id) ON DELETE CASCADE', 'Người đặt'],
    ['showtime_id', 'BIGINT', 'NOT NULL, FK → showtimes(id) ON DELETE CASCADE', 'Suất chiếu'],
    ['booking_code', 'VARCHAR(32)', 'NOT NULL, UNIQUE', 'Mã vé (12 ký tự hex viết hoa)'],
    ['seat_numbers', 'TEXT[]', "NOT NULL, DEFAULT '{}'", 'Mảng danh sách ghế (VD: {A1,A2})'],
    ['total_price', 'NUMERIC(12,2)', 'NOT NULL, CHECK >= 0', 'Tổng tiền = giá vé × số ghế'],
    ['status', 'VARCHAR(20)', "DEFAULT 'pending', CHECK IN ('pending','confirmed','cancelled','completed')", 'Trạng thái đơn vé'],
    ['booked_at / updated_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm đặt/cập nhật'],
  ],
  [1900, 1500, 2900, 2771],
));
add(caption('Bảng 2.8: Bảng contacts – tin nhắn liên hệ'));
add(table(
  ['Tên cột', 'Kiểu', 'Ràng buộc', 'Mô tả'],
  [
    ['id', 'BIGSERIAL', 'PRIMARY KEY', 'Mã tin nhắn'],
    ['full_name', 'VARCHAR(255)', 'NOT NULL', 'Họ tên người gửi'],
    ['email', 'VARCHAR(255)', 'NOT NULL', 'Email liên hệ'],
    ['phone', 'VARCHAR(20)', '', 'Số điện thoại (tuỳ chọn)'],
    ['message', 'TEXT', 'NOT NULL', 'Nội dung phản hồi'],
    ['status', 'VARCHAR(20)', "DEFAULT 'new', CHECK IN ('new','read','done')", 'Trạng thái xử lý'],
    ['created_at / updated_at', 'TIMESTAMPTZ', 'DEFAULT NOW()', 'Thời điểm gửi/cập nhật'],
  ],
  [1900, 1500, 2900, 2771],
));
add(p('2.4.3. Ngôn ngữ định nghĩa dữ liệu (DDL)'));
add(p('Toàn bộ cấu trúc bảng được định nghĩa trong file schema.sql và được server tự động thực thi khi khởi động (hàm initializeDatabase()), đảm bảo idempotent nhờ các mệnh đề IF NOT EXISTS và ADD COLUMN IF NOT EXISTS. Phần DDL minh hoạ:'));
add(codeBlock([
  'CREATE TABLE IF NOT EXISTS users (',
  '  id BIGSERIAL PRIMARY KEY,',
  '  full_name VARCHAR(255) NOT NULL,',
  '  email VARCHAR(255) NOT NULL UNIQUE,',
  '  password_hash VARCHAR(255) NOT NULL,',
  '  phone VARCHAR(20),',
  '  role VARCHAR(20) NOT NULL DEFAULT \'customer\',',
  '  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),',
  '  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),',
  '  CHECK (role IN (\'customer\', \'admin\'))',
  ');',
  '',
  'CREATE TABLE IF NOT EXISTS showtimes (',
  '  ...',
  '  UNIQUE (room, start_time),',
  '  CHECK (end_time > start_time),',
  '  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE',
  ');',
], 'Mã nguồn 2.1: Trích DDL định nghĩa bảng users và showtimes (schema.sql)'));
add(h2('2.5. Thiết kế luồng nghiệp vụ'));
add(p('Luồng 1 – Đăng ký tài khoản: client gửi {fullName, email, password, phone} → server kiểm tra dữ liệu bắt buộc, mật khẩu ≥ 6 ký tự, định dạng email → chuẩn hoá email (lowercase) và họ tên (trim) → bcrypt.hash(password, 10) → INSERT INTO users ... RETURNING → tạo JWT → trả 201 kèm token và user. Nếu email trùng (lỗi SQL 23505) → trả 409.'));
add(p('Luồng 2 – Đăng nhập: client gửi {email, password} → server tìm user theo email đã chuẩn hoá → bcrypt.compare(password, password_hash) → nếu sai trả 401 → nếu đúng tạo JWT, xoá password_hash khỏi dữ liệu trả về, trả 200 kèm token và user.'));
add(p('Luồng 3 – Đặt vé (nghiệp vụ cốt lõi):'));
add(numbered(1, 'Kiểm tra đầu vào: showtimeId là số nguyên dương; seatNumbers là mảng 1–10 ghế, không rỗng, không trùng nhau.'));
add(numbered(2, 'BEGIN transaction; khoá bản ghi suất chiếu bằng SELECT ... FOR UPDATE để hai client không xử lý cùng lúc.'));
add(numbered(3, 'Kiểm tra suất chiếu tồn tại (404), trạng thái "available" (409 nếu không), số ghế trống đủ (409 nếu không).'));
add(numbered(4, 'Truy vấn danh sách ghế đã đặt của các đơn "pending"/"confirmed" cho suất chiếu đó; nếu có ghế trùng → ROLLBACK và trả 409 kèm danh sách ghế xung đột.'));
add(numbered(5, 'Tính tổng tiền = price × số ghế; sinh mã vé bằng crypto.randomBytes(6) (12 ký tự hex viết hoa); INSERT booking status "confirmed"; UPDATE showtimes giảm available_seats.'));
add(numbered(6, 'COMMIT transaction; trả 201 kèm chi tiết vé (join bookings – showtimes – movies).'));
add(p('Luồng 4 – Xóa phim: BEGIN → DELETE showtimes WHERE movie_id → DELETE movies ... RETURNING → COMMIT; nếu phim không tồn tại trả 404; lỗi phát sinh → ROLLBACK. Giao dịch đảm bảo không để lại "mồ côi" suất chiếu khi phim bị xoá.'));
add(h2('2.6. Thiết kế giao diện người dùng'));
add(p('Giao diện thiết kế theo phong cách hiện đại, lấy cảm hứng từ các trang bán vé phim, với bố cục: header dính (sticky) có hiệu ứng kính (backdrop-filter), khu vực nội dung chính gồm bốn view, ba modal (chi tiết phim, chọn ghế, vé điện tử) và thanh thông báo toast. Hệ thống màu sắc được định nghĩa tập trung qua CSS custom properties để dễ thay đổi theme.'));
add(caption('Bảng 2.8: Hệ thống màu sắc của giao diện'));
add(table(
  ['Biến CSS', 'Giá trị', 'Ý nghĩa'],
  [
    ['--primary', '#635BFF', 'Màu chính (nút bấm, thương hiệu)'],
    ['--primary-dark', '#4941D6', 'Màu chính đậm (hover)'],
    ['--primary-soft', '#EEEDFF', 'Nền nhấn nhẹ'],
    ['--success', '#14865C', 'Thành công / trạng thái "đang chiếu"'],
    ['--danger', '#C9424F', 'Cảnh báo, xoá, trạng thái "đã chiếu"'],
    ['--text / --muted', '#172033 / #69758C', 'Văn bản chính / phụ'],
    ['--bg / --surface', '#F5F7FB / #FFFFFF', 'Nền trang / nền thẻ'],
    ['--radius / --shadow', '18px / đổ nhẹ', 'Bo góc và bóng thẻ'],
  ],
  [2000, 2200, 4871],
));
add(pageBreak());

/* ===== Chuong 3 ===== */
add(h1('CHƯƠNG 3: XÂY DỰNG VÀ HIỆN THỰC HỆ THỐNG'));
add(h2('3.1. Môi trường phát triển'));
add(p('Đồ án được phát triển trên hệ điều hành Windows, sử dụng Node.js làm runtime, npm để quản lý phụ thuộc, PostgreSQL cài đặt cục bộ (localhost:5432) và nodemon để tự động khởi động lại server khi chỉnh sửa mã. Các script trong package.json: "npm run dev" (chạy dev với nodemon) và "npm start" (chạy sản phẩm với node server.js).'));
add(h2('3.2. Cấu trúc thư mục dự án'));
add(p('Dự án tổ chức theo kiến trúc phân tầng rõ ràng: config (kết nối CSDL), middleware (xác thực), routes (định tuyến), controllers (xử lý nghiệp vụ), public (frontend tĩnh). Cấu trúc chi tiết:'));
add(codeBlock([
  'MovieTicket2/',
  '├── server.js                  # Điểm khởi chạy, mount routes, error handler',
  '├── schema.sql                 # DDL: users, movies, showtimes, bookings',
  '├── package.json               # Phụ thuộc và script (start, dev)',
  '├── .env                       # Cấu hình môi trường (DB, JWT) – không commit',
  '├── config/',
  '│   └── db.js                  # Pool kết nối PostgreSQL + khởi tạo schema',
  '├── middleware/',
  '│   ├── authMiddleware.js      # Xác thực JWT Bearer token',
  '│   └── requireAdmin.js        # Phân quyền vai trò admin',
  '├── routes/',
  '│   ├── auth.js                # /api/auth: register, login',
  '│   ├── movies.js              # /api/movies: list, get, create, update, delete (admin)',
  '│   ├── showtimes.js           # /api/showtimes: list, get, create, update, delete (admin)',
  '│   ├── bookings.js            # /api/bookings: create, history',
  '│   └── contacts.js            # /api/contacts: create, list, update, delete (admin)',
  '├── controllers/',
  '│   ├── authController.js      # register, login (bcrypt + jwt)',
  '│   ├── moviesController.js    # listMovies, getMovie, createMovie, updateMovie, deleteMovie',
  '│   ├── showtimesController.js # listShowtimes, getShowtime, create, update, delete',
  '│   ├── bookingsController.js  # createBooking (FOR UPDATE), getBookingHistory',
  '│   └── contactsController.js  # createContact, listContacts, updateContact, deleteContact',
  '├── seed.js                    # Dữ liệu mẫu: admin + phim + suất chiếu',
  '└── public/',
  '    ├── index.html             # SPA shell: 4 view + 3 modal + toast',
  '    ├── app.js                 # Logic SPA, gọi API, ghế ngồi, vé điện tử',
  '    ├── styles.css             # Theme CSS variables, responsive',
  '    └── images/movies/         # Ảnh poster phim',
], 'Mã nguồn 3.1: Cấu trúc thư mục dự án MovieTicket2'));
add(h2('3.3. Cấu hình và khởi chạy hệ thống'));
add(p('Cấu hình hệ thống nằm trong file .env, được nạp bởi dotenv ngay đầu server.js. Nội dung cấu hình:'));
add(caption('Bảng 3.1: Cấu hình trong file .env'));
add(table(
  ['Biến', 'Giá trị mẫu', 'Mô tả'],
  [
    ['PORT', '5000', 'Cổng HTTP của server'],
    ['DB_USER / DB_PASSWORD', 'postgres / ***', 'Tài khoản PostgreSQL'],
    ['DB_HOST / DB_PORT', 'localhost / 5432', 'Địa chỉ và cổng CSDL'],
    ['DB_NAME', 'movieticket_db', 'Tên cơ sở dữ liệu'],
    ['JWT_SECRET', '***', 'Khoá bí mật ký JWT (cần đổi trước khi chạy thật)'],
    ['JWT_EXPIRES_IN', '1h', 'Thời hạn hiệu lực token'],
  ],
  [2600, 2400, 4071],
));
add(p('Quy trình khởi động server.js: (1) nạp .env; (2) tạo Express app, bật express.json() để đọc body JSON và express.static() để phục vụ thư mục public; (3) đăng ký router gốc với hai endpoint chẩn đoán GET / (thông báo API đang chạy) và GET /health (kiểm tra kết nối CSDL bằng câu truy vấn SELECT 1); (4) mount ba nhóm route /api/auth, /api/movies, /api/bookings; (5) đăng ký middleware xử lý lỗi tập trung (log lỗi và trả 500); (6) gọi initializeDatabase() để tạo bảng nếu chưa có, sau đó app.listen(PORT). Nếu khởi tạo CSDL thất bại, server in lỗi và thoát (process.exit(1)) để tránh chạy với CSDL không sẵn sàng.'));
add(h2('3.4. Tầng kết nối cơ sở dữ liệu'));
add(p('File config/db.js tạo một Pool kết nối PostgreSQL từ các biến môi trường. Pool giữ lại các kết nối đã mở để tái sử dụng, tránh chi phí mở kết nối mới cho mỗi request – đây là yếu tố quan trọng cho hiệu năng khi nhiều người đặt vé cùng lúc. Hàm initializeDatabase() đọc toàn bộ file schema.sql và thực thi một lần khi server khởi động.'));
add(codeBlock([
  'const fs = require(\'fs\');',
  'const path = require(\'path\');',
  'const { Pool } = require(\'pg\');',
  '',
  'const pool = new Pool({',
  '  user: process.env.DB_USER,',
  '  password: process.env.DB_PASSWORD,',
  '  host: process.env.DB_HOST,',
  '  port: Number(process.env.DB_PORT),',
  '  database: process.env.DB_NAME,',
  '});',
  '',
  'async function initializeDatabase() {',
  '  const schemaPath = path.join(__dirname, \'..\', \'schema.sql\');',
  '  const schema = await fs.promises.readFile(schemaPath, \'utf8\');',
  '  await pool.query(schema);',
  '}',
  '',
  'module.exports = { pool, initializeDatabase };',
], 'Mã nguồn 3.2: Toàn bộ file config/db.js (kết nối pool + khởi tạo schema)'));
add(h2('3.5. Middleware xác thực JWT'));
add(p('Middleware authMiddleware.js bảo vệ các route yêu cầu đăng nhập. Nó trích xuất token từ header Authorization (định dạng "Bearer <token>"), xác minh bằng jwt.verify() với khoá JWT_SECRET. Khi thiếu token trả về 401 ("Không tìm thấy token xác thực"); token sai hoặc hết hạn trả về 403 ("Token không hợp lệ hoặc đã hết hạn"); hợp lệ thì gắn payload (userId, role) vào req.user và gọi next() để tiếp tục xử lý.'));
add(codeBlock([
  'const jwt = require(\'jsonwebtoken\');',
  '',
  'module.exports = (req, res, next) => {',
  '  const authHeader = req.headers[\'authorization\'];',
  '  const token = authHeader && authHeader.split(\' \')[1];',
  '  if (!token) {',
  '    return res.status(401).json({ message: \'Không tìm thấy token xác thực\' });',
  '  }',
  '  jwt.verify(token, process.env.JWT_SECRET || \'your_secret_key\', (err, user) => {',
  '    if (err) {',
  '      return res.status(403).json({ message: \'Token không hợp lệ hoặc đã hết hạn\' });',
  '    }',
  '    req.user = user;',
  '    next();',
  '  });',
  '};',
], 'Mã nguồn 3.3: File middleware/authMiddleware.js'));
add(h2('3.6. Module xác thực người dùng'));
add(p('Module authController.js gồm hai hàm register và login, được định tuyến tại routes/auth.js: POST /api/auth/register và POST /api/auth/login.'));
add(p('Hàm signToken() tạo JWT chứa userId và role, thời hạn theo JWT_EXPIRES_IN (mặc định 1 giờ):'));
add(codeBlock([
  'function signToken(user) {',
  '  return jwt.sign(',
  '    { userId: user.id, role: user.role },',
  '    process.env.JWT_SECRET,',
  '    { expiresIn: process.env.JWT_EXPIRES_IN || \'1h\' },',
  '  );',
  '}',
], 'Mã nguồn 3.4: Hàm tạo JWT (controllers/authController.js)'));
add(p('Quy tắc kiểm tra dữ liệu đầu vào khi đăng ký:'));
add(caption('Bảng 3.2: Quy tắc validate đăng ký tài khoản'));
add(table(
  ['Trường', 'Quy tắc', 'Lỗi trả về'],
  [
    ['fullName, email, password', 'Bắt buộc, kiểu chuỗi, không rỗng', '400 – "fullName, email và password là bắt buộc"'],
    ['password', 'Độ dài tối thiểu 6 ký tự', '400 – "Mật khẩu phải có ít nhất 6 ký tự"'],
    ['email', 'Đúng định dạng (regex ^\\S+@\\S+\\.\\S+$), chuẩn hoá lowercase', '400 – "Email không hợp lệ"'],
    ['email (trùng)', 'UNIQUE trên CSDL (bắt lỗi SQLSTATE 23505)', '409 – "Email đã tồn tại"'],
    ['phone', 'Tuỳ chọn, phải là chuỗi nếu có', '400 – "Phone phải là chuỗi"'],
  ],
  [2200, 3900, 2971],
));
add(p('Sau khi validate, register thực hiện bcrypt.hash(password, 10), chèn user mới với role mặc định "customer" và trả về 201 kèm token cùng thông tin user (không chứa password_hash). Hàm login truy vấn user theo email đã chuẩn hoá, dùng bcrypt.compare() để đối chiếu mật khẩu; sai trả 401 ("Email hoặc mật khẩu không đúng"), đúng thì tạo token và xoá password_hash trước khi trả dữ liệu:'));
add(codeBlock([
  'const user = result.rows[0];',
  'if (!user || !(await bcrypt.compare(password, user.password_hash))) {',
  '  return res.status(401).json({ message: \'Email hoặc mật khẩu không đúng\' });',
  '}',
  'const token = signToken(user);',
  'delete user.password_hash;',
  'res.json({ message: \'Đăng nhập thành công\', token, user });',
], 'Mã nguồn 3.5: So sánh mật khẩu và tạo token khi đăng nhập'));
add(h2('3.7. Module quản lý phim'));
add(p('Module moviesController.js cài đặt bốn thao tác CRUD, được định tuyến tại routes/movies.js. Điểm nhấn của module:'));
add(bullet('listMovies (GET /api/movies): hỗ trợ lọc theo status (bằng) và genre (tìm gần đúng ILIKE, tham số hoá để chống SQL injection). Truy vấn con tính giá vé thấp nhất trong các suất chiếu "available" của phim để hiển thị cột ticket_price, kết quả sắp xếp theo created_at DESC (mới nhất lên đầu).'));
add(bullet('getMovie (GET /api/movies/:id): kiểm tra id là số nguyên dương (400 nếu sai), trả 404 nếu không tồn tại.'));
add(bullet('createMovie (POST /api/movies): validate title bắt buộc, durationMinutes là số nguyên dương, status thuộc tập {upcoming, showing, ended}, ageRating thuộc {P, C13, C16, C18}; chèn và trả 201. Route yêu cầu authenticateToken + requireAdmin (chỉ quản trị viên).'));
add(bullet('updateMovie (PUT /api/movies/:id): cập nhật từng phần (partial update) các trường title, description, durationMinutes, genre, releaseDate, posterUrl, ageRating, status; mỗi trường đều được validate như khi thêm; nếu không tồn tại trả 404; trả về phim sau cập nhật.'));
add(bullet('deleteMovie (DELETE /api/movies/:id): gắn authenticateToken và requireAdmin – chỉ admin mới được xóa (role khác trả 403). Xoá phim trong transaction để đồng thời xoá hết suất chiếu thuộc phim đó.'));
add(caption('Bảng 3.3: Middleware requireAdmin kiểm tra vai trò (routes/movies.js)'));
add(codeBlock([
  'function requireAdmin(req, res, next) {',
  '  if (!req.user || String(req.user.role || \'\').toLowerCase() !== \'admin\') {',
  '    return res.status(403).json({ message: \'Bạn không có quyền thực hiện thao tác này\' });',
  '  }',
  '  return next();',
  '}',
  'router.delete(\'/\', authenticateToken, requireAdmin, deleteMovie);',
], 'Mã nguồn 3.6: Phân quyền admin cho route xoá phim'));
add(codeBlock([
  'client = await pool.connect();',
  'await client.query(\'BEGIN\');',
  'const showtimesResult = await client.query(\'DELETE FROM showtimes WHERE movie_id = $1\', [id]);',
  'const movieResult = await client.query(\'DELETE FROM movies WHERE id = $1 RETURNING id, title\', [id]);',
  'await client.query(\'COMMIT\');',
  '// Nếu phim không tồn tại -> 404; có lỗi -> ROLLBACK',
], 'Mã nguồn 3.7: Transaction xoá phim và suất chiếu (controllers/moviesController.js)'));
add(h2('3.8. Module đặt vé'));
add(p('Module bookingsController.js chứa nghiệp vụ cốt lõi của đồ án. Route POST /api/bookings gắn authenticateToken nên chỉ người đã đăng nhập mới đặt được vé; req.user.userId được dùng làm chủ sở hữu đơn vé.'));
add(p('Hàm generateBookingCode() dùng crypto.randomBytes(6).toString(\'hex\').toUpperCase() tạo mã vé 12 ký tự duy nhất (xác suất trùng cực thấp, kết hợp ràng buộc UNIQUE trên CSDL).'));
add(p('Hàm createBooking() thực hiện đầy đủ luồng nghiệp vụ đã thiết kế ở mục 2.5. Đoạn mã khoá hàng và kiểm tra xung đột ghế:'));
add(codeBlock([
  'await client.query(\'BEGIN\');',
  'const showtimeResult = await client.query(',
  '  `SELECT id, price, available_seats, status FROM showtimes WHERE id = $1 FOR UPDATE`,',
  '  [normalizedShowtimeId]',
  ');',
  '// ...kiểm tra 404 / 409 (status, available_seats)',
  'const bookedSeatsResult = await client.query(',
  '  `SELECT seat_numbers FROM bookings WHERE showtime_id = $1 AND status IN (\'pending\', \'confirmed\')`,',
  '  [normalizedShowtimeId]',
  ');',
  'const conflictedSeats = normalizedSeatNumbers.filter((seat) => bookedSeats.has(seat));',
  'if (conflictedSeats.length) {',
  '  await client.query(\'ROLLBACK\');',
  '  return res.status(409).json({ message: \'Một hoặc nhiều ghế đã được đặt\', seats: conflictedSeats });',
  '}',
], 'Mã nguồn 3.8: Khóa hàng FOR UPDATE và phát hiện ghế trùng (controllers/bookingsController.js)'));
add(p('Sau khi qua các bước kiểm tra, hệ thống tính totalPrice = price × số ghế, chèn booking với status "confirmed" và mảng seat_numbers, cập nhật giảm available_seats, rồi truy vấn join ba bảng bookings – showtimes – movies để trả về chi tiết vé (mã vé, ghế, tổng tiền, rạp/phòng, giờ chiếu, tên phim, poster). Hàm getBookingHistory() (GET /api/bookings/history) liệt kê vé của chính người dùng đang đăng nhập (WHERE b.user_id = $1), sắp xếp theo thời gian đặt giảm dần – người dùng không thể xem vé của người khác.'));
add(h2('3.9. Module quản lý suất chiếu'));
add(p('Module showtimesController.js cài đặt đầy đủ CRUD suất chiếu, được định tuyến tại routes/showtimes.js. Danh sách (GET /api/showtimes) hỗ trợ lọc theo ngày (date=YYYY-MM-DD, dùng khoảng start_time 00:00–23:59 để tận dụng index) và theo phim (movieId), kết nối JOIN movies để trả về thông tin phim lồng trong mỗi suất chiếu – đây là dữ liệu trang Lịch chiếu sử dụng.'));
add(bullet('createShowtime (POST /api/showtimes, admin): validate movieId tồn tại, startTime hợp lệ, room bắt đầu, format thuộc {2D, 3D, IMAX, 4DX}, price ≥ 0, availableSeats ≥ 0 (mặc định 48); tự tính end_time = start_time + duration_minutes của phim nếu client không truyền; bắt lỗi 23505 (UNIQUE room+start_time) → 409 "Phòng này đã có suất chiếu cùng giờ".'));
add(bullet('updateShowtime (PUT /api/showtimes/:id, admin): cập nhật từng phần; khi đổi phim hoặc giờ bắt đầu mà không truyền end_time, hệ thống tự tính lại end_time theo thời lượng phim mới; bắt lỗi trùng giờ → 409.'));
add(bullet('deleteShowtime (DELETE /api/showtimes/:id, admin): trước khi xoá, kiểm tra số đơn vé thuộc suất chiếu – nếu đã có vé đặt thì trả 409 "Không thể xoá suất chiếu đã có đơn vé đặt" để bảo toàn lịch sử giao dịch; ngược lại xoá và trả 200.'));
add(h2('3.10. Module liên hệ'));
add(p('Module contactsController.js quản lý tin nhắn phản hồi từ trang Liên hệ, định tuyến tại routes/contacts.js:'));
add(bullet('createContact (POST /api/contacts, công khai): validate họ tên, email (đúng định dạng), nội dung bắt buộc (tối đa 5000 ký tự), số điện thoại tuỳ chọn; chèn với status mặc định "new" và trả 201.'));
add(bullet('listContacts (GET /api/contacts, admin): liệt kê tin nhắn mới nhất lên đầu, hỗ trợ lọc theo status (new/read/done).'));
add(bullet('updateContact (PUT /api/contacts/:id, admin): đổi trạng thái xử lý (new → read → done) hoặc cập nhật nội dung.'));
add(bullet('deleteContact (DELETE /api/contacts/:id, admin): xoá tin nhắn; không tồn tại trả 404.'));
add(h2('3.11. Danh mục API endpoints'));
add(caption('Bảng 3.4: Toàn bộ API endpoints của hệ thống'));
add(table(
  ['Method', 'Path', 'Xác thực', 'Mô tả'],
  [
    ['GET', '/', '-', 'Thông báo API đang chạy'],
    ['GET', '/health', '-', 'Kiểm tra kết nối CSDL (SELECT 1)'],
    ['POST', '/api/auth/register', '-', 'Đăng ký tài khoản khách hàng'],
    ['POST', '/api/auth/login', '-', 'Đăng nhập, trả về JWT'],
    ['GET', '/api/movies', '-', 'Danh sách phim (lọc status, genre), giá vé từ'],
    ['GET', '/api/movies/:id', '-', 'Chi tiết phim'],
    ['POST', '/api/movies', 'Admin', 'Thêm phim mới'],
    ['PUT', '/api/movies/:id', 'Admin', 'Sửa phim (cập nhật từng phần)'],
    ['DELETE', '/api/movies/:id', 'Admin', 'Xoá phim cùng suất chiếu (transaction)'],
    ['GET', '/api/showtimes', '-', 'Suất chiếu (lọc date, movieId), kèm thông tin phim'],
    ['GET', '/api/showtimes/:id', '-', 'Chi tiết suất chiếu'],
    ['POST', '/api/showtimes', 'Admin', 'Thêm suất chiếu (tự tính end_time)'],
    ['PUT', '/api/showtimes/:id', 'Admin', 'Sửa suất chiếu'],
    ['DELETE', '/api/showtimes/:id', 'Admin', 'Xoá suất chiếu (chặn nếu đã có vé)'],
    ['POST', '/api/bookings', 'Customer', 'Đặt vé (transaction, FOR UPDATE, chống trùng ghế)'],
    ['GET', '/api/bookings/history', 'Customer', 'Lịch sử đặt vé của user đang đăng nhập'],
    ['POST', '/api/contacts', '-', 'Gửi liên hệ (trang Liên hệ)'],
    ['GET', '/api/contacts', 'Admin', 'Danh sách tin nhắn liên hệ'],
    ['PUT', '/api/contacts/:id', 'Admin', 'Cập nhật liên hệ (trạng thái/nội dung)'],
    ['DELETE', '/api/contacts/:id', 'Admin', 'Xoá liên hệ'],
  ],
  [1100, 2900, 1500, 3571],
));
add(h2('3.12. Frontend ứng dụng trang đơn'));
add(p('3.12.1. Cấu trúc file public/index.html'));
add(p('File index.html là "vỏ" của SPA, gồm: header với thương hiệu MovieTicket2, thanh điều hướng năm mục (Trang chủ – Danh sách phim – Lịch chiếu – Vé của tôi – Liên hệ) và hộp thông tin người dùng (avatar chữ cái đầu, tên, badge Admin, nút đăng xuất); năm section view (homeView, moviesView, scheduleView, bookingsView, contactView) được ẩn/hiện qua thuộc tính hidden và lớp is-active; bốn modal (seatModal – chọn ghế, movieModal – chi tiết phim, ticketModal – vé điện tử) cùng toast; form thêm/sửa phim chỉ hiển thị với admin (movieFormPanel), panel quản lý suất chiếu (showtimeAdminPanel) trong view Lịch chiếu và panel quản lý tin nhắn liên hệ (contactAdminPanel) trong view Liên hệ. Script app.js được nạp với thuộc tính defer và khởi tạo khi DOMContentLoaded.'));
add(p('3.12.2. Quản lý token và gọi API'));
add(p('Hai khoá localStorage movieTicketToken và movieTicketUser lưu token và thông tin user, giúp duy trì đăng nhập khi tải lại trang. Hàm apiRequest() đóng vai trò trung tâm cho mọi cuộc gọi API: tự động đính kèm header Authorization nếu có token, đặt Content-Type JSON khi có body, phát hiện phản hồi 401 để tự động xoá phiên (đăng xuất khi token hết hạn), parse JSON và ném Error chứa thông báo lỗi từ server để UI hiển thị toast.'));
add(codeBlock([
  'async function apiRequest(path, options = {}) {',
  '  const headers = new Headers(options.headers || {});',
  '  const token = getToken();',
  '  if (token) headers.set(\'Authorization\', `Bearer ${token}`);',
  '  if (options.body && !headers.has(\'Content-Type\')) headers.set(\'Content-Type\', \'application/json\');',
  '  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });',
  '  if (response.status === 401) {',
  '    setAuthData(null, null);',
  '    renderUser();',
  '    renderBookingAccess();',
  '  }',
  '  const data = await response.json().catch(() => ({}));',
  '  if (!response.ok) throw new Error(data.message || \'Có lỗi xảy ra. Vui lòng thử lại.\');',
  '  return data;',
  '}',
], 'Mã nguồn 3.9: Hàm gọi API tập trung (public/app.js)'));
add(p('3.12.3. Điều hướng SPA'));
add(p('Hàm switchSection(sectionName) ẩn/hiện các view, cập nhật trạng thái active của thanh điều hướng, tải dữ liệu theo ngữ cảnh (loadMovies khi mở danh sách phim, loadSchedule khi mở lịch chiếu, renderBookingAccess khi mở vé của tôi) và cuộn trang về đầu – tạo trải nghiệm chuyển trang mượt mà không tải lại trình duyệt.'));
add(p('3.12.4. Module quản lý phim trên giao diện'));
add(p('Hàm loadMovies() gọi GET /api/movies và tạo thẻ phim (movie-card) gồm ảnh poster (tải qua resolvePosterSource với cơ chế whitelist ngăn path traversal), lớp overlay hiện thông tin khi hover, badge trạng thái, badge độ tuổi (P/C13/C16/C18), giá vé từ và nút xem chi tiết. Người dùng admin còn thấy nút Sửa phim và Xóa phim. Form thêm/sửa phim (submitMovie) hoạt động ở hai chế độ: khi không có editingMovieId gửi POST /api/movies để thêm; khi openEditMovie() điền dữ liệu phim vào form và đặt editingMovieId, submitMovie gửi PUT /api/movies/:id để cập nhật, nút "Huỷ chỉnh sửa" (cancelEditMovie) đưa form về chế độ thêm. Hàm showMovieDetail() hiển thị chi tiết phim trong modal.'));
add(p('3.12.5. Lịch chiếu, chọn ghế và quản lý suất chiếu'));
add(p('Màn hình lịch chiếu tạo dãy 10 ngày (getScheduleDates) với nhãn thứ/tự động đánh dấu "Hôm nay". Dữ liệu suất chiếu được tải từ GET /api/showtimes?date=... (bao gồm thông tin phim lồng trong mỗi suất), chuẩn hoá linh hoạt bởi normalizeScheduleData() (hỗ trợ nhiều dạng payload) và nhóm theo định dạng (2D/3D/IMAX kết hợp phụ đề/lồng tiếng) qua groupShowtimesByFormat(). Khi bấm một suất chiếu, openSeatModal() yêu cầu đăng nhập rồi mở modal chọn ghế với lưới 6 dãy (A–F) × 8 ghế, mỗi bấm chọn cập nhật Set selectedSeats, hiển thị danh sách ghế đã chọn và tổng tiền (số ghế × giá vé) theo thời gian thực.'));
add(p('Với admin, panel quản lý suất chiếu (showtimeAdminPanel) hiển thị trong trang Lịch chiếu: form thêm/sửa suất chiếu (chọn phim, ngày, giờ bắt đầu, phòng, định dạng, giá vé, số ghế) và danh sách các suất trong ngày kèm nút Sửa/Xoá. Hàm submitShowtime() gửi POST hoặc PUT /api/showtimes, openEditShowtime() điền form theo suất đã chọn, deleteShowtime() gửi DELETE (lưu ý suất đã có vé sẽ bị backend từ chối với 409).'));
add(codeBlock([
  'const rows = [\'A\', \'B\', \'C\', \'D\', \'E\', \'F\'];',
  'const cols = 8;',
  'rows.forEach((row) => {',
  '  for (let c = 1; c <= cols; c += 1) {',
  '    const seatCode = `${row}${c}`;',
  '    // render seat-btn, bấm để add/delete trong Set selectedSeats',
  '  }',
  '});',
  'const totalPrice = selectedSeats.size * price;',
], 'Mã nguồn 3.12: Lưới ghế ngồi 6×8 và tính tổng tiền (public/app.js)'));
add(p('3.10.6. Đặt vé và vé điện tử'));
add(p('Hàm submitBooking() gửi yêu cầu đặt vé với mã suất chiếu và danh sách ghế đã chọn. Khi thành công (201), hệ thống đóng modal ghế và mở ticketModal hiển thị vé điện tử dạng "ticket pass": phần stub chứa thương hiệu, mã vé, mã vạch SVG và trạng thái; phần thân chứa poster, tên phim, badge định dạng, thông tin rạp/phòng, ngày chiếu, suất chiếu, dãy ghế, số ghế, ngày xuất vé và TICKET ID. Vé đi kèm hai thao tác: In vé (window.print() với lớp .printing-ticket để CSS in chỉ hiển thị vé) và Tải vé (tạo Blob HTML vé đầy đủ và tự động tải file movie-ticket-<CODE>.html).'));
add(codeBlock([
  'function barcodeSvg(value) {',
  '  const code = String(value || \'MT2\').toUpperCase().replace(/[^A-Z0-9]/g, \'\') || \'MT2\';',
  '  let x = 8;',
  '  let bars = \'\';',
  '  for (let index = 0; index < code.length; index += 1) {',
  '    const seed = code.charCodeAt(index) + index * 7;',
  '    const width = seed % 5 === 0 ? 4 : seed % 3 === 0 ? 3 : 2;',
  '    const gap = seed % 4 === 0 ? 4 : 2;',
  '    bars += `<rect x="${x}" y="5" width="${width}" height="42" rx="1"></rect>`;',
  '    x += width + gap;',
  '  }',
  '  return `<svg class="barcode-svg" viewBox="0 0 220 54">...</svg>`;',
  '}',
], 'Mã nguồn 3.11: Sinh mã vạch SVG xác định từ mã vé (public/app.js)'));
add(p('3.12.7. Lịch sử đặt vé'));
add(p('Hàm loadBookingHistory() gọi API lịch sử và hiển thị thẻ vé (booking-card) cho mỗi đơn: mã vé, trạng thái, tên phim, rạp/phòng, giờ chiếu, danh sách ghế và nút "Xem vé điện tử" để mở lại ticketModal với dữ liệu cũ. Nút "Xem vé của tôi" mở nhanh vé mới đặt nhất (phần tử đầu danh sách).'));
add(p('3.12.8. Các tiện ích bảo mật và định dạng'));
add(bullet('escapeHtml(): thoát hoá các ký tự &, <, >, ", \' trước khi chèn dữ liệu vào innerHTML – phòng chống XSS khi hiển thị dữ liệu từ API.'));
add(bullet('formatCurrency() / formatDateTime() / formatDate() / formatTime(): chuẩn hoá hiển thị theo locale vi-VN (tiền VND, ngày/tháng/năm, giờ:phút).'));
add(bullet('resolvePosterSource(): chỉ cho phép URL http(s) hoặc tên file an toàn trong /images/movies, từ chối các chuỗi chứa "..", "?", "#", ":" – ngăn path traversal khi tải ảnh.'));
add(p('3.12.9. Trang liên hệ'));
add(p('View Liên hệ (contactView) gồm hai phần: cột thông tin rạp (địa chỉ, hotline, email, giờ làm việc) và form gửi phản hồi (submitContact). Form validate họ tên, email, nội dung bắt buộc rồi gửi POST /api/contacts; thành công hiển thị toast cảm ơn. Với admin, panel quản lý liên hệ (contactAdminPanel) liệt kê tin nhắn (loadContacts) kèm badge trạng thái (Mới/Đã đọc/Hoàn tất) và các nút: Đã đọc, Hoàn tất (gửi PUT /api/contacts/:id đổi status) và Xoá (gửi DELETE /api/contacts/:id).'));
add(h2('3.13. Giao diện và định dạng CSS'));
add(p('File public/styles.css định nghĩa toàn bộ giao diện theo hướng hiện đại: sử dụng CSS custom properties cho theme (Bảng 2.8), bố cục flexbox và CSS Grid (feature-grid, movie-grid, seat-map, ticket-info-grid, contact-grid, manage-list), hiệu ứng gradient nền, bo góc 18px, đổ bóng nhẹ và header kính dính (position: sticky + backdrop-filter). File hỗ trợ responsive từ 320 px, có trạng thái disabled cho nút khi xử lý, các lớp badge/badge-success/badge-danger cho trạng thái nghiệp vụ, highlight form khi chỉnh sửa phim (.is-editing), và các quy tắc @media print để in vé gọn gàng.'));
add(pageBreak());

/* ===== Chuong 4 ===== */
add(h1('CHƯƠNG 4: KIỂM THỬ VÀ KẾT QUẢ'));
add(h2('4.1. Môi trường và phương pháp kiểm thử'));
add(p('Kiểm thử được thực hiện trên trình duyệt Chrome (giao diện SPA), công cụ Postman (kiểm thử trực tiếp API) và công cụ truy vấn CSDL (psql/pgAdmin) để kiểm tra dữ liệu nền. Dữ liệu kiểm thử gồm hai tài khoản: một khách hàng thường và một tài khoản quản trị viên (role = admin được cập nhật trực tiếp trên CSDL), cùng dữ liệu mẫu phim và suất chiếu.'));
add(p('Phương pháp: kiểm thử hộp đen theo từng endpoint với dữ liệu hợp lệ và không hợp lệ; kiểm thử luồng end-to-end trên giao diện (đăng ký → đăng nhập → xem phim → đặt vé → xem vé); kiểm thử đồng thời bằng hai client gửi yêu cầu đặt cùng một ghế để xác minh cơ chế FOR UPDATE.'));
add(h2('4.2. Kiểm thử xác thực người dùng'));
add(caption('Bảng 4.1: Test case đăng ký – đăng nhập'));
add(table(
  ['STT', 'Mô tả', 'Dữ liệu vào / thao tác', 'Kết quả mong đợi'],
  [
    ['1', 'Đăng ký hợp lệ', 'fullName "Nguyễn Văn A", email a@example.com, password 123456', '201 – tài khoản + token, role customer'],
    ['2', 'Đăng ký thiếu email', 'Chỉ gửi fullName, password', '400 – "fullName, email và password là bắt buộc"'],
    ['3', 'Mật khẩu quá ngắn', 'password "123"', '400 – "Mật khẩu phải có ít nhất 6 ký tự"'],
    ['4', 'Email sai định dạng', 'email "abc@@xyz"', '400 – "Email không hợp lệ"'],
    ['5', 'Email đã tồn tại', 'Đăng ký lại email a@example.com', '409 – "Email đã tồn tại"'],
    ['6', 'Đăng nhập đúng', 'Email + mật khẩu đúng', '200 – token + user (không chứa password_hash)'],
    ['7', 'Đăng nhập sai mật khẩu', 'Mật khẩu không khớp', '401 – "Email hoặc mật khẩu không đúng"'],
    ['8', 'Token hết hạn', 'Gọi API với token > 1h', '403 – "Token không hợp lệ hoặc đã hết hạn"'],
  ],
  [700, 2100, 3300, 2971],
));
add(h2('4.3. Kiểm thử quản lý phim'));
add(caption('Bảng 4.2: Test case quản lý phim'));
add(table(
  ['STT', 'Mô tả', 'Dữ liệu vào / thao tác', 'Kết quả mong đợi'],
  [
    ['1', 'Xem danh sách phim', 'GET /api/movies', '200 – mảng movies kèm ticket_price, mới nhất lên đầu'],
    ['2', 'Lọc phim', 'GET /api/movies?status=showing&genre=Hành', '200 – phim đang chiếu, thể loại chứa "Hành" (ILIKE)'],
    ['3', 'Chi tiết phim', 'GET /api/movies/:id', '200 – đủ trường; id sai → 400; không tồn tại → 404'],
    ['4', 'Thêm phim', 'POST /api/movies (đầy đủ trường)', '201 – movie mới; thiếu title → 400; duration ≤ 0 → 400'],
    ['5', 'Xoá phim (customer)', 'DELETE /api/movies/:id với token customer', '403 – "Bạn không có quyền thực hiện thao tác này"'],
    ['6', 'Xoá phim (admin)', 'DELETE /api/movies/:id với token admin', '200 – phim và toàn bộ suất chiếu bị xoá (deletedShowtimes)'],
    ['7', 'Xoá phim không tồn tại', 'DELETE /api/movies/999999 (admin)', '404 – "Không tìm thấy phim"'],
  ],
  [700, 2100, 3300, 2971],
));
add(h2('4.4. Kiểm thử đặt vé'));
add(caption('Bảng 4.3: Test case đặt vé'));
add(table(
  ['STT', 'Mô tả', 'Dữ liệu vào / thao tác', 'Kết quả mong đợi'],
  [
    ['1', 'Đặt vé thành công', 'POST /api/bookings, showtimeId hợp lệ, 2 ghế A1,A2', '201 – booking_code 12 ký tự, total = giá×2, available_seats giảm 2'],
    ['2', 'Chưa đăng nhập', 'POST /api/bookings không token', '401 – yêu cầu xác thực'],
    ['3', 'Ghế trùng trong request', 'seatNumbers ["A1","A1"]', '400 – "Không được chọn ghế trùng nhau"'],
    ['4', 'Vượt quá 10 ghế', 'seatNumbers gồm 11 ghế', '400 – "Seatnumbers phải là mảng gồm 1 đến 10 ghế hợp lệ"'],
    ['5', 'Ghế đã được đặt', 'Đặt lại ghế A1 ở suất đã đặt thành công', '409 – "Một hoặc nhiều ghế đã được đặt" kèm seats'],
    ['6', 'Hết ghế trống', 'Đặt nhiều ghế hơn available_seats', '409 – "Số ghế đã vượt quá số ghế khả dụng"'],
    ['7', 'Suất chiếu không khả dụng', 'showtime status = cancelled/completed', '409 – "Suất chiếu không còn khả dụng"'],
    ['8', 'Đồng thời (race test)', 'Hai client cùng đặt ghế B1 của một suất', 'Đúng 1 request thành công, 1 request nhận 409 – không overbooking'],
    ['9', 'Lịch sử đặt vé', 'GET /api/bookings/history (đã đăng nhập)', '200 – danh sách vé của chính user, mới nhất lên đầu'],
  ],
  [700, 2100, 3300, 2971],
));
add(h2('4.5. Kiểm thử giao diện'));
add(caption('Bảng 4.4: Test case giao diện'));
add(table(
  ['STT', 'Mô tả', 'Kết quả mong đợi'],
  [
    ['1', 'Chuyển đổi 4 mục điều hướng', 'View tương ứng được hiện, thanh nav cập nhật active, không tải lại trang'],
    ['2', 'Đăng ký/đăng nhập qua form', 'Toast thông báo thành công, user-box hiện avatar + tên, tự động chuyển sang Vé của tôi'],
    ['3', 'Chọn ghế trong modal', 'Ghế bấm đổi trạng thái selected, tổng tiền cập nhật theo thời gian thực, nút xác nhận khoá khi chưa chọn ghế'],
    ['4', 'Vé điện tử', 'Modal vé hiển thị đủ thông tin + mã vạch SVG; nút In vé mở hộp thoại in; nút Tải vé tải file HTML'],
    ['5', 'Responsive & thông báo', 'Giao diện hiển thị tốt ở 320 px trở lên; toast tự ẩn sau 3,5 giây; lỗi API hiển thị thông báo tiếng Việt'],
  ],
  [700, 3600, 4771],
));
add(h2('4.6. Đánh giá kết quả kiểm thử'));
add(p('Các test case về API (Bảng 4.1–4.3) đều cho kết quả đúng như thiết kế: xác thực JWT hoạt động chính xác với ba trạng thái 401/403/200; phân quyền admin chặn đúng user thường; transaction đặt vé đảm bảo không đặt trùng ghế và không vượt số ghế trống, kể cả khi hai client gửi yêu cầu đồng thời. Giao diện (Bảng 4.4) đạt yêu cầu về trải nghiệm SPA, thông báo và vé điện tử. Kết quả kiểm tra CSDL sau các thao tác cho thấy available_seats luôn khớp với thực tế đặt vé, booking_code không trùng và dữ liệu liên kết (user_id, showtime_id, movie_id) luôn nhất quán.'));
add(pageBreak());

/* ===== Ket luan ===== */
add(h1('KẾT LUẬN'));
add(p('Sau quá trình thực hiện, đồ án đã hoàn thành đầy đủ các mục tiêu đề ra: xây dựng thành công website đặt vé xem phim trực tuyến MovieTicket2 với RESTful API (Node.js + Express), cơ sở dữ liệu PostgreSQL chuẩn hoá bốn bảng, xác thực JWT kết hợp phân quyền admin, mã hoá mật khẩu bcrypt, giao diện SPA thân thiện và vé điện tử có mã vạch. Hệ thống đảm bảo tính toàn vẹn dữ liệu trong nghiệp vụ đặt vé nhờ transaction và khoá hàng FOR UPDATE, đồng thời phòng chống các lỗi thường gặp (SQL injection, XSS, lộ mật khẩu).'));
add(p('Một số hạn chế cần khắc phục trong thời gian tới:'));
add(numbered(1, 'Giao diện lịch chiếu (scheduleView) đã sẵn sàng nhưng backend chưa có endpoint GET /api/showtimes để trả dữ liệu suất chiếu theo ngày – cần bổ sung controller và route showtimes (hoặc seed dữ liệu mẫu) để trang lịch chiếu hoạt động end-to-end.'));
add(numbered(2, 'Đồng bộ hoá hợp đồng frontend – backend ở ba điểm nhỏ: payload đặt vé của seat modal đang gửi trường "seats" trong khi backend yêu cầu "seatNumbers"; route lịch sử frontend gọi GET /api/bookings trong khi backend định nghĩa GET /api/bookings/history; form đặt vé thủ công trong view "Vé của tôi" chưa gắn sự kiện submit.'));
add(numbered(3, 'Endpoint POST /api/movies hiện chưa yêu cầu xác thực – nên gắn authenticateToken và requireAdmin giống route xoá phim để tránh ai cũng có thể thêm phim.'));
add(numbered(4, 'Thư viện cors đã khai báo trong package.json nhưng chưa được sử dụng (chỉ cần thiết khi tách frontend sang domain khác).'));
add(p('Hướng phát triển tiếp theo: bổ sung quản lý suất chiếu và ghế cho admin (CRUD showtimes), tích hợp thanh toán trực tuyến (MoMo/ZaloPay), phân trang và tìm kiếm nâng cao cho danh sách phim, gửi email xác nhận vé, upload ảnh poster thay vì nhập tên file, container hoá bằng Docker và triển khai lên dịch vụ đám mây.'));
add(p('Qua đồ án, em đã nắm được quy trình phát triển ứng dụng web thực tế: từ phân tích yêu cầu, thiết kế CSDL, xây dựng API có bảo mật đến kiểm thử nghiệp vụ. Đây là nền tảng quan trọng để em tiếp tục hoàn thiện các đồ án chuyên sâu hơn trong các học phần sau.'));
add(pageBreak());

/* ===== Tai lieu tham khao ===== */
add(h1('TÀI LIỆU THAM KHẢO'));
add(numbered(1, 'Express.js official documentation. https://expressjs.com/'));
add(numbered(2, 'Node.js official documentation. https://nodejs.org/docs/'));
add(numbered(3, 'PostgreSQL official documentation. https://www.postgresql.org/docs/'));
add(numbered(4, 'MDN Web Docs – Fetch API, localStorage, Intl, SVG. https://developer.mozilla.org/'));
add(numbered(5, 'Jones, M. và others. RFC 7519 – JSON Web Token (JWT). https://datatracker.ietf.org/doc/html/rfc7519'));
add(numbered(6, 'OWASP – Password Storage Cheat Sheet (bcrypt). https://cheatsheetseries.owasp.org/'));

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

const targets = [
  path.join(__dirname, 'Bao_cao_do_an_MovieTicket2.docx'),
  path.join(__dirname, 'Bao_cao_do_an_MovieTicket2_CHITIET.docx'),
];
let written = null;
for (const t of targets) {
  try {
    fs.writeFileSync(t, zipBuf);
    written = t;
    break;
  } catch (e) {
    console.log(`Khong the ghi ${path.basename(t)}: ${e.message.split('\n')[0]}`);
  }
}
if (!written) {
  console.error('FAILED to write report');
  process.exit(1);
}
console.log(`Da tao bao cao: ${written}`);
console.log(`Kich thuoc: ${(zipBuf.length / 1024).toFixed(1)} KB`);
