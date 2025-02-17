require("dotenv").config(); // Load environment variables from a .env file

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3001; // Use a port from .env or default to 3001

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON bodies

// Set up SQLite database
const db = new sqlite3.Database("./fastm8.db", (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to SQLite database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`
    );
  }
});

// Create fast_logs table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS fast_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    startTime TEXT NOT NULL,
    endTime TEXT,
    duration INTEGER,
    isComplete BOOLEAN,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  )`
);

// Test route to check if backend is running
app.get("/status", (req, res) => {
  res.json({ status: "active" });
});

// API Route to create a new user
app.post("/api/users", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const saltRounds = 10; // Define the salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(query, [username, email, hashedPassword], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, username, email });
    });
  } catch (error) {
    res.status(500).json({ error: "Error hashing password" });
  }
});

// API Route to login a user
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ message: "Login successful", username: user.username });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

// API Route to log fasting session
app.post("/log", (req, res) => {
  const { userId, startTime, endTime, duration, isComplete } = req.body;

  if (
    !userId ||
    !startTime ||
    (isComplete && !endTime) ||
    (isComplete && !duration)
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `INSERT INTO fast_logs (userId, startTime, endTime, duration, isComplete) 
                 VALUES (?, ?, ?, ?, ?)`;
  db.run(
    query,
    [userId, startTime, endTime, duration, isComplete],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to log fasting session" });
      }
      res.status(201).json({
        message: "Fasting session logged successfully",
        fastId: this.lastID,
      });
    }
  );
});

// Get open fasting logs by userId (where isComplete is false)
app.get("/api/open-logs", (req, res) => {
  const userId = req.query.userId; // Get userId from query parameters

  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  const query = `SELECT * FROM fast_logs WHERE userId = ? AND isComplete = false`;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "No open fasting logs found" });
    }
    res.json(rows); // Return all open fasting logs for the user
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
