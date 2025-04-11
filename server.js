require("dotenv").config(); // Load environment variables from a .env file

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
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

    // Compare password with the hash in the database
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET, // Secret key from environment variables
        { expiresIn: "1h" } // Token expires in 1 hour
      );

      // Send token along with user info
      res.json({
        message: "Login successful",
        token: token, // Send JWT token
        username: user.username,
        userId: user.id,
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

// API Route to create a new fasting log
app.post("/api/logs", (req, res) => {
  const { userId, startTime, endTime, duration, isComplete } = req.body;

  console.log("Received data for new log:", req.body); // Log received data

  if (!userId || !startTime || isComplete === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `INSERT INTO fast_logs (userId, startTime, endTime, duration, isComplete) VALUES (?, ?, ?, ?, ?)`;

  db.run(
    query,
    [userId, startTime, endTime, duration, isComplete],
    function (err) {
      if (err) {
        console.error("Error inserting log:", err); // Log any error from the query
        return res.status(500).json({ error: "Database error" });
      }
      // Return the new log's ID
      console.log("Log created with ID:", this.lastID); // Log the created log ID
      res.status(201).json({
        message: "Fast log created successfully",
        id: this.lastID, // ID of the new log
      });
    }
  );
});

app.get("/api/open-logs", (req, res) => {
  const token = req.headers["authorization"]; // Get Authorization header
  const { startTime, endTime } = req.query; // Get date range parameters

  // Check if token is provided
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  // Validate date format if provided
  const isValidDate = (dateString) => {
    if (!dateString) return true;

    // Check for full ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    // Check for date-only format (YYYY-MM-DD)
    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

    return isoRegex.test(dateString) || dateOnlyRegex.test(dateString);
  };

  if (startTime && !isValidDate(startTime)) {
    return res.status(400).json({
      error:
        "Invalid startTime format. Expected either YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ",
    });
  }

  if (endTime && !isValidDate(endTime)) {
    return res.status(400).json({
      error:
        "Invalid endTime format. Expected either YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ",
    });
  }

  // Extract the token (Bearer token)
  const tokenWithoutBearer = token.split(" ")[1]; // Removing the 'Bearer ' prefix

  // Verify the token using the JWT secret
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // If token is valid, extract the userId from the decoded token
    const userId = decoded.userId; // Assuming the token contains the userId

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Build the query based on whether date range parameters are provided
    let query = `SELECT * FROM fast_logs WHERE userId = ?`;
    const queryParams = [userId];

    if (startTime) {
      query += ` AND startTime >= ?`;
      queryParams.push(startTime);
    }

    if (endTime) {
      query += ` AND startTime <= ?`;
      queryParams.push(endTime);
    }

    // Order by startTime in descending order (most recent first)
    query += ` ORDER BY startTime DESC`;

    db.all(query, queryParams, (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (rows.length === 0) {
        return res.status(200).json({ message: "No fasting logs found" });
      }
      res.json(rows); // Return all fasting logs for the user within the date range
    });
  });
});

// API Route to edit fasting logs
app.put("/api/logs/edit", (req, res) => {
  const { logIds, edits } = req.body;

  // Log the received data for debugging purposes
  console.log("Received data:", req.body);

  // Validate the input
  if (!logIds || !edits || logIds.length !== edits.length) {
    return res.status(400).json({
      error: "logIds and edits must have the same length.",
      receivedLogIdsLength: logIds.length,
      receivedEditsLength: edits.length,
    });
  }

  // Loop over each logId and apply corresponding edits
  const updatePromises = logIds.map((logId, index) => {
    const edit = edits[index]; // Get the edit for the current logId
    const { startTime, endTime, isComplete } = edit;

    // Build the SET clause dynamically based on which fields are provided
    let updateFields = [];
    let values = [];

    if (startTime) {
      updateFields.push("startTime = ?");
      values.push(startTime);
    }

    if (endTime) {
      updateFields.push("endTime = ?");
      values.push(endTime);
    }

    if (isComplete !== undefined) {
      updateFields.push("isComplete = ?");
      values.push(isComplete);
    }

    // If no fields to update, skip this logId
    if (updateFields.length === 0) {
      return Promise.resolve(0); // No updates, resolve with 0 changes
    }

    // Combine the updateFields and logId into the SQL query
    const query = `UPDATE fast_logs SET ${updateFields.join(
      ", "
    )} WHERE id = ?`;

    // Execute the update query
    return new Promise((resolve, reject) => {
      db.run(query, [...values, logId], function (err) {
        if (err) {
          reject(err); // Reject the promise if an error occurs
        } else {
          resolve(this.changes); // Resolve with the number of affected rows
        }
      });
    });
  });

  // Wait for all update promises to complete
  Promise.all(updatePromises)
    .then((results) => {
      // Count the number of successful updates
      const updatedLogsCount = results.filter((changes) => changes > 0).length;
      res
        .status(200)
        .json({ message: `${updatedLogsCount} logs updated successfully.` });
    })
    .catch((error) => {
      console.error("Error updating logs:", error);
      res.status(500).json({ error: "Error updating logs" });
    });
});

// API Route to delete fasting logs by userId
app.delete("/api/logs", (req, res) => {
  const userId = req.query.userId; // Get userId from query parameters

  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  const query = `DELETE FROM fast_logs WHERE userId = ? AND isComplete = false`;

  db.run(query, [userId], function (err) {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (this.changes === 0) {
      // If no rows were deleted, return a message but with a 200 status
      return res
        .status(200)
        .json({ message: "No open fasting logs found to delete." });
    }

    // If rows were deleted, return a success message
    res.status(200).json({
      message: `Successfully deleted ${this.changes} log(s) for userId ${userId}.`,
    });
  });
});

// timerange

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
