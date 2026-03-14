const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'sentinel.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    start_time DATETIME,
    end_time DATETIME,
    focus_score REAL,
    mood TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    status TEXT DEFAULT 'pending',
    topic TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS focus_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    blink_score REAL,
    is_drowsy INTEGER,
    FOREIGN KEY(session_id) REFERENCES sessions(id)
  );

  -- Ensure a default user exists for hardcoded frontend requests
  INSERT OR IGNORE INTO users (id, username, password) VALUES (1, 'sentinel_user', 'password123');
`);

console.log("📁 SQLite Database initialized.");

module.exports = db;
