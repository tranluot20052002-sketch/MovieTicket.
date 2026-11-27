/* Script seed du lieu mau de demo: tai khoan admin, phim mau, suat chieu mau */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./config/db');

async function seed() {
  console.log('Dang chuan bi du lieu mau...');

  const adminCheck = await pool.query(
    "SELECT id FROM users WHERE email = 'admin@example.com'",
  );

  if (!adminCheck.rows[0]) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')`,
      ['Quản trị viên', 'admin@example.com', passwordHash],
    );
    console.log('Da tao tai khoan admin -> email: admin@example.com | mat khau: admin123');
  } else {
    console.log('Tai khoan admin da ton tai');
  }

  const movieCount = await pool.query('SELECT COUNT(*) AS total FROM movies');

  if (Number(movieCount.rows[0].total) === 0) {
    const movies = [
      ['Quỷ Tử Vượt Giàu', 'Câu chuyện hài hước về chàng trai nghèo bất ngờ trở thành tài phiệt và những tình huống dở khóc dở cười trên hành trình vươn lên.', 118, 'Hài hước', '2026-01-30', 'quy-tu-vuot-giau.jpg', 'showing', 'P'],
      ['Mai', 'Bộ phim tình cảm xoay quanh mối duyên phận lỡ làng giữa hai con người ở hai miền ký ức.', 128, 'Tình cảm', '2026-01-30', 'mai.png', 'showing', 'C13'],
      ['Kẻ Anh Hùng', 'Siêu anh hùng đường phố đối đầu thế lực bóng tối trong cuộc chiến bảo vệ thành phố.', 112, 'Hành động', '2026-02-06', 'ke-anh-hung.webp', 'showing', 'C13'],
      ['Nghỉ Hè Số 7', 'Chuyến nghỉ hè kỳ diệu của nhóm bạn nhỏ tại căn nhà số 7 bên bờ biển.', 105, 'Gia đình', '2026-06-12', 'nghi-he-so-nghi-huu.jpg', 'upcoming', 'P'],
    ];

    for (const movie of movies) {
      await pool.query(
        `INSERT INTO movies (title, description, duration_minutes, genre, release_date, poster_url, status, age_rating)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        movie,
      );
    }
    console.log('Da them 4 phim mau');
  } else {
    console.log('Da co du lieu phim, bo qua buoc them phim');
  }

  const movieResult = await pool.query(
    "SELECT id, duration_minutes FROM movies WHERE status = 'showing' ORDER BY id",
  );

  if (!movieResult.rows.length) {
    console.log('Khong co phim dang chieu de tao suat mau');
    await pool.end();
    return;
  }

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const existing = await pool.query(
    'SELECT COUNT(*) AS total FROM showtimes WHERE start_time >= $1 AND start_time <= $2',
    [`${todayKey}T00:00:00`, `${todayKey}T23:59:59.999`],
  );

  if (Number(existing.rows[0].total) > 0) {
    console.log('Da co suat chieu hom nay, bo qua buoc tao suat mau');
    await pool.end();
    return;
  }

  const slots = [
    { time: '10:00', room: 'R1', format: '2D', price: 90000 },
    { time: '14:00', room: 'R2', format: '2D', price: 90000 },
    { time: '19:30', room: 'R3', format: '3D', price: 110000 },
    { time: '21:30', room: 'R1', format: 'IMAX', price: 130000 },
  ];

  let showtimeCount = 0;
  for (const movie of movieResult.rows) {
    for (const slot of slots) {
      const start = new Date(`${todayKey}T${slot.time}:00`);
      const end = new Date(start.getTime() + Number(movie.duration_minutes) * 60000);
      await pool.query(
        `INSERT INTO showtimes (movie_id, start_time, end_time, room, cinema_name, format, price, available_seats)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [movie.id, start, end, slot.room, 'CGV Cinema', slot.format, slot.price, 48],
      );
      showtimeCount += 1;
    }
  }

  console.log(`Da tao ${showtimeCount} suat chieu mau cho hom nay (${todayKey})`);
  await pool.end();
  console.log('Hoan tat seed du lieu');
}

seed().catch((error) => {
  console.error('Seed that bai:', error.message);
  process.exit(1);
});
