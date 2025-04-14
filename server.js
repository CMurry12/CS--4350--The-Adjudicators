// server.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer configuration
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// STUDENT REGISTER
app.post("/api/student/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO students (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashed,
    ]);
    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    console.error("Student register error:", err);
    res.status(500).json({ error: "Server error during student registration" });
  }
});

// STUDENT LOGIN
app.post("/api/student/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM students WHERE email = ?", [email]);
    const student = rows[0];

    if (!student) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    res.json({ id: student.id, name: student.name, email: student.email });
  } catch (err) {
    console.error("Student login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// JUDGE REGISTER
app.post("/api/judges/register", async (req, res) => {
  const { judgeId, password } = req.body;

  if (!judgeId || !password) {
    return res.status(400).json({ error: "Judge ID and password are required." });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO judges (judgeId, password) VALUES (?, ?)", [
      judgeId,
      hashed,
    ]);
    res.status(201).json({ message: "Judge registered successfully" });
  } catch (err) {
    console.error("Judge register error:", err);
    res.status(500).json({ error: "Server error during judge registration" });
  }
});

// JUDGE LOGIN
app.post("/api/judges/login", async (req, res) => {
  const { judgeId, password } = req.body;
  if (!judgeId || !password) {
    return res.status(400).json({ error: "Judge ID and password required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM judges WHERE judgeId = ?", [judgeId]);
    const judge = rows[0];

    if (!judge) return res.status(404).json({ error: "Judge not found" });

    const match = await bcrypt.compare(password, judge.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    res.json({ id: judge.id, judgeId: judge.judgeId });
  } catch (err) {
    console.error("Judge login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ADD EVENT
app.post("/api/events", async (req, res) => {
  const { name, date } = req.body;

  if (!name || !date) {
    return res.status(400).json({ error: "Name and date are required." });
  }

  try {
    await db.query("INSERT INTO events (name, date) VALUES (?, ?)", [name, date]);
    res.status(201).json({ message: "Event added successfully" });
  } catch (err) {
    console.error("Event creation error:", err);
    res.status(500).json({ error: "Server error while adding event" });
  }
});

// GET EVENTS
app.get("/api/events", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM events ORDER BY date ASC");
    res.json(rows);
  } catch (err) {
    console.error("Fetch events error:", err);
    res.status(500).json({ error: "Server error while fetching events" });
  }
});

// PROJECT UPLOAD
app.post("/api/projects/upload", upload.single("file"), async (req, res) => {
  const { title, description, eventId } = req.body;
  const file = req.file;

  if (!title || !description || !eventId || !file) {
    return res.status(400).json({ error: "All fields and file are required." });
  }

  try {
    await db.query(
      "INSERT INTO projects (title, description, file_path, event_id) VALUES (?, ?, ?, ?)",
      [title, description, file.filename, eventId]
    );
    res.status(201).json({ message: "Project uploaded successfully!" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error while uploading project" });
  }
});

// PROJECT REVIEW (weighted score)
app.post("/api/projects/review", async (req, res) => {
  const { judgeId, projectId, creativity, impact, execution, feasibility, design, feedback } = req.body;

  if (!judgeId || !projectId || creativity == null || impact == null || execution == null || feasibility == null || design == null) {
    return res.status(400).json({ error: "All scoring fields are required." });
  }

  // Weighted score calculation (e.g. out of 10)
  const finalScore = (
    creativity * 0.2 +
    impact * 0.25 +
    execution * 0.2 +
    feasibility * 0.15 +
    design * 0.2
  ).toFixed(2);

  try {
    await db.query(
      "INSERT INTO reviews (judge_id, project_id, creativity, impact, execution, feasibility, design, final_score, feedback) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [judgeId, projectId, creativity, impact, execution, feasibility, design, finalScore, feedback]
    );
    res.status(201).json({ message: "Review submitted successfully!" });
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ error: "Server error while submitting review" });
  }
});
app.get('/dmin-analytics', (req, res) => {
  res.sendFile(path.join(__dirname,"public","admin-analytics.html"));
});
app.get('/Judge-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Judge-login.html'));
});

app.get('/Leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Leaderboard.html'));
});

app.get('/admin-analytics', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-analytics.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

app.get('/admin-events', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-events.html'));
});

app.get('/admin-judges', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-judges.html'));
});

app.get('/admin-projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-projects.html'));
});

app.get('/admin.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.js'));
});

app.get('/auth.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth.js'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/judge-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'judge-dashboard.html'));
});

app.get('/judge-events', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'judge-events.html'));
});

app.get('/judge-scoring', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'judge-scoring.html'));
});

app.get('/judge.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'judge.js'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects.html?id=123'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/registeras', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registeras.html'));
});

app.get('/student-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student-dashboard.html'));
});

app.get('/student-register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student-register.html'));
});

app.get('/student.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student.js'));
});

app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

app.get('/db.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'db.js'));
});

app.get('/package-lock.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'package-lock.json'));
});

app.get('/package.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'package.json'));
});

app.get('/schema.sql', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'schema.sql'));
});

})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
