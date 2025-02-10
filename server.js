require("dotenv").config(); // Load environment variables from a .env file

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000; // Use a port from .env or default to 3000

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON bodies

// Set up SQLite database
const db = new sqlite3.Database("./fastm8.db", (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create a simple table if it doesn't exist
db.run(
    `CREATE TABLE IF NOT EXISTS fast_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time TEXT NOT NULL,
        end_time TEXT
    )`
);

// Test route to check if backend is running
app.get("/status", (req, res) => {
    res.json({ status: "active" });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});