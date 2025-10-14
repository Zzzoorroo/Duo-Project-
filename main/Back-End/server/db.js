const Database = require("better-sqlite3");

const db = new Database('./main/Back-End/data/duoproject.db')

db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        text TEXT,
        time TEXT
        )
    `).run();

module.exports = db;