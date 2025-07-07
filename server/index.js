import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'diary',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00' 
};

const pool = mysql.createPool(dbConfig);

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS diary_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        title TEXT NOT NULL,
        body LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_date (user_id, date)
      )
    `);

    connection.release();
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
      [fullName, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.insertId, email, fullName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: result.insertId, email, fullName }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, fullName: user.full_name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/diary/:date', authenticateToken, async (req, res) => {
  const { date } = req.params;
  const userId = req.user.id;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM diary_entries WHERE user_id = ? AND date = ?',
      [userId, date]
    );

    res.json(rows.length > 0 ? rows[0] : null);
  } catch (error) {
    console.error('Get diary entry error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/diary', authenticateToken, async (req, res) => {
  const { date, title, body } = req.body;
  const userId = req.user.id;

  if (!date || !title || !body) {
    return res.status(400).json({ error: 'Date, title, and body are required' });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  const today = new Date();
  const entryDate = new Date(date + 'T00:00:00');
  
  today.setHours(23, 59, 59, 999);
  
  if (entryDate > today) {
    return res.status(400).json({ error: 'Cannot create diary entries for future dates' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO diary_entries (user_id, date, title, body) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       title = VALUES(title), 
       body = VALUES(body), 
       updated_at = CURRENT_TIMESTAMP`,
      [userId, date, title, body]
    );

    const [savedEntry] = await pool.execute(
      'SELECT * FROM diary_entries WHERE user_id = ? AND date = ?',
      [userId, date]
    );

    res.json(savedEntry[0]);
  } catch (error) {
    console.error('Save diary entry error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/diary-dates', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.execute(
      'SELECT date FROM diary_entries WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );

    const dates = rows.map(row => {
      const date = new Date(row.date);
      return date.toISOString().split('T')[0];
    });
    
    res.json(dates);
  } catch (error) {
    console.error('Get diary dates error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  });
});