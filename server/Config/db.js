require("dotenv").config();
const mysql2 = require("mysql2");

const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log("❗Database is not connected");
    } else {
        console.log("✅ Database is connected");
    }
});

module.exports = db;