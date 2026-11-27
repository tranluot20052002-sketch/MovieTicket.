require('dotenv').config();

const path = require('path');
const express = require('express');
const { pool, initializeDatabase } = require('./config/db');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const bookingRoutes = require('./routes/bookings');
const showtimeRoutes = require('./routes/showtimes');
const contactRoutes = require('./routes/contacts');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

// Phục vụ các file tĩnh trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'MovieTicket2 API is running' });
});

router.get('/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

app.use(router);
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/contacts', contactRoutes);

// Middleware xử lý lỗi tập trung
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

async function start() {
  try {
    await initializeDatabase();
    console.log('Database schema initialized');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize the application:', error.message);
    process.exit(1);
  }
}

start();