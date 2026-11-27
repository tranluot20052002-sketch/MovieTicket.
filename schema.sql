CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (role IN ('customer', 'admin'))
);

CREATE TABLE IF NOT EXISTS movies (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  genre VARCHAR(100),
  release_date DATE,
  poster_url TEXT,
  age_rating VARCHAR(10) NOT NULL DEFAULT 'P',
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (duration_minutes > 0),
  CHECK (status IN ('upcoming', 'showing', 'ended')),
  CHECK (age_rating IN ('P', 'C13', 'C16', 'C18'))
);

ALTER TABLE movies ADD COLUMN IF NOT EXISTS age_rating VARCHAR(10) NOT NULL DEFAULT 'P';

ALTER TABLE showtimes ADD COLUMN IF NOT EXISTS cinema_name VARCHAR(100) NOT NULL DEFAULT 'CGV Cinema';
ALTER TABLE showtimes ADD COLUMN IF NOT EXISTS format VARCHAR(10) NOT NULL DEFAULT '2D';

CREATE TABLE IF NOT EXISTS showtimes (
  id BIGSERIAL PRIMARY KEY,
  movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  room VARCHAR(50) NOT NULL,
  cinema_name VARCHAR(100) NOT NULL DEFAULT 'CGV Cinema',
  format VARCHAR(10) NOT NULL DEFAULT '2D',
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  available_seats INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_time > start_time),
  CHECK (price >= 0),
  CHECK (available_seats >= 0),
  CHECK (status IN ('available', 'cancelled', 'completed')),
  UNIQUE (room, start_time)
);

ALTER TABLE showtimes ADD COLUMN IF NOT EXISTS cinema_name VARCHAR(100) NOT NULL DEFAULT 'CGV Cinema';
ALTER TABLE showtimes ADD COLUMN IF NOT EXISTS format VARCHAR(10) NOT NULL DEFAULT '2D';

CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  showtime_id BIGINT NOT NULL REFERENCES showtimes(id) ON DELETE CASCADE,
  booking_code VARCHAR(32) NOT NULL UNIQUE,
  seat_numbers TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  total_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (total_price >= 0),
  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (status IN ('new', 'read', 'done'))
);
