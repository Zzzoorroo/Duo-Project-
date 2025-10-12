const Database = require("better-sqlite3");

const db = new Database('duoproject.db')

db.prepare(`
    CRETE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        text TEXT,
        time TEXT
        )
    `).run();

module.exports = db;