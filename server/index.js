require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("../server/Config/db");
const studentsignup = require("../server/Routes/signup");

app.use(express.json());
app.use(cors());
console.log("📦 studentsignup router loaded");
app.use("/course-enrollment", studentsignup);

app.use((req, res, next) => {
    console.log("🚨 Unmatched request:", req.method, req.url);
    next();
});

app.use("/", (req, res) => {
    return res.status(404).json({ message: "404-Page not Found" });
})

app.listen(process.env.PORT, () => {
    console.log(`Server runs at http://localhost:${process.env.PORT}`);
})