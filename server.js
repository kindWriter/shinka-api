import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3000;

// строку подключения возьмём из переменной окружения DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// создаём таблицу, если её ещё нет
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT NOT NULL,
      date DATE NOT NULL,
      time TIME,
      comment TEXT,
      source TEXT DEFAULT 'site',
      status TEXT DEFAULT 'new'
    );
  `);
  console.log('DB ready');
}

// простой healthcheck
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'shinka-api' });
});

// TODO: здесь позже добавим маршруты POST/GET/PATCH

app.listen(port, async () => {
  try {
    await initDb();
    console.log(`Server started on port ${port}`);
  } catch (e) {
    console.error('DB init error', e);
  }
});
