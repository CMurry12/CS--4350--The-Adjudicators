// server.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

// Other existing routes for events, projects, etc. can go below...

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

