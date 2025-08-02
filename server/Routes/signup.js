require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../Config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/student-sign-up", async (req, res) => {
    console.log("🟢 student-sign-up route hit");
    const { name, email, password } = req.body;
    console.log("📥 Received Body:", req.body);

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email_regex.test(email)) {
        return res.status(400).json({ message: "Enter a valid Email ID" });
    }

    const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!password_regex.test(password)) {
        return res.status(400).json({
            message: `
                <ul>
                    <li>At least <strong>1 lowercase</strong> letter</li>
                    <li>At least <strong>1 uppercase</strong> letter</li>
                    <li>At least <strong>1 digit</strong></li>
                    <li>At least <strong>1 special character</strong></li>
                    <li>Minimum length: <strong>8 characters</strong></li>
                </ul>
            `
        });
    }

    try {
        const hashed_password = await bcrypt.hash(password, 10);
        const values = [name, email, hashed_password];
        const sql_query = "INSERT INTO students (name, email, password) VALUES (?, ?, ?)";

        db.query(sql_query, values, (err, results) => {
            if (err) {
                console.error("❗Error:", err.message);
                return res.status(400).json({ message: "❌ Data not inserted into database" });
            }
            console.log("✅ Data Successfully Inserted:", results);
            return res.status(200).json({ message: "🎉 Data Inserted Successfully" });
        });
    } catch (error) {
        console.error("Server Error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/test", (req, res) => {
    res.send("✅ Test route working");
});

router.post("/student-sign-in", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("❗All fields are required");
        return res.status(400).json({ message: "❗All fields are required" });
    }

    const check_query = "SELECT * FROM students WHERE email=?";
    db.query(check_query, [email], (err, result) => {
        if (err) {
            return res.status(400).json({ message: "❗Invalid credentials" });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: "❗User not found" });
        }

        const user = result[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(400).json({ message: "❗Password is not found" });
            }

            if (!isMatch) {
                return res.status(400).json({ message: "❗Password mismatch" })
            } else {
                const token = jwt.sign(
                    { id: user.id, name: user.name, email: user.email },
                    process.env, JWT_SECRET_KEY,
                    { expiresIn: "1h" }
                        );

                console.log("📨 Generated Token: ", token);
                const { password, ...userWithoutPassword } = user;

                return res.status(200).json({
                    message: `🎉 Welcome Back ${user.name}`
                    ,
                    user: { ...userWithoutPassword, token }
                }
                )
            }
        })
    })
})

module.exports = router;