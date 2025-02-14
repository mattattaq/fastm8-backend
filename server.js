require("dotenv").config(); // Load environment variables from a .env file

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000; // Use a port from .env or default to 3000

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

// API Route to create a new user
app.post("/api/users", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const saltRounds = 10; // Define the salt rounds
    // Inside your POST /api/users route
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
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

  // Find user by email
  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ message: "Login successful", username: user.username });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
