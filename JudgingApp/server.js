require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db"); // Make sure this uses the Railway env vars

const app = express();
const PORT = process.env.PORT || 3000;

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public"))); // Frontend

// === Multer Upload Config ===
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// === Serve Home Page ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// === Student Routes ===
app.post("/api/student/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO students (name, email, password) VALUES (?, ?, ?)", [
      name, email, hashed,
    ]);
    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    console.error("Student register error:", err);
    res.status(500).json({ error: "Server error during student registration" });
  }
});

app.post("/api/student/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

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

app.get("/api/student/profile/:id", async (req, res) => {
  const studentId = req.params.id;
  try {
    const [[student]] = await db.query("SELECT name, email FROM students WHERE id = ?", [studentId]);
    const [[{ projectCount }]] = await db.query("SELECT COUNT(*) AS projectCount FROM projects WHERE user_id = ?", [studentId]);
    const [[{ eventCount }]] = await db.query("SELECT COUNT(DISTINCT event_id) AS eventCount FROM projects WHERE user_id = ?", [studentId]);

    res.json({ name: student.name, email: student.email, projectCount, eventCount });
  } catch (err) {
    console.error("Profile summary error:", err);
    res.status(500).json({ error: "Failed to load student profile summary." });
  }
});

// === Judge Routes ===
app.post("/api/judges/register", async (req, res) => {
  const { judgeId, password } = req.body;
  if (!judgeId || !password)
    return res.status(400).json({ error: "Judge ID and password are required." });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO judges (judgeId, password) VALUES (?, ?)", [judgeId, hashed]);
    res.status(201).json({ message: "Judge registered successfully" });
  } catch (err) {
    console.error("Judge register error:", err);
    res.status(500).json({ error: "Server error during judge registration" });
  }
});

app.post("/api/judges/login", async (req, res) => {
  const { judgeId, password } = req.body;
  if (!judgeId || !password)
    return res.status(400).json({ error: "Judge ID and password required" });

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

app.get("/api/judges", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, judgeId FROM judges");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching judges:", err);
    res.status(500).json({ error: "Failed to load judges" });
  }
});

app.post("/api/judge_event", async (req, res) => {
  const { judgeId, eventId } = req.body;
  if (!judgeId || !eventId)
    return res.status(400).json({ error: "Missing judgeId or eventId" });

  try {
    await db.query("INSERT INTO judge_event (judge_id, event_id) VALUES (?, ?)", [judgeId, eventId]);
    res.status(201).json({ message: "Judge assigned to event" });
  } catch (err) {
    console.error("Error assigning judge:", err);
    res.status(500).json({ error: "Failed to assign judge" });
  }
});

app.get("/api/judges/:id/events", async (req, res) => {
  const judgeId = req.params.id;
  try {
    const [rows] = await db.query(`
      SELECT events.id, events.name, events.date 
      FROM events 
      JOIN judge_event ON events.id = judge_event.event_id 
      WHERE judge_event.judge_id = ?`,
      [judgeId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching assigned events:", err);
    res.status(500).json({ error: "Failed to fetch assigned events" });
  }
});

// === Events ===
app.post("/api/events", async (req, res) => {
  const { name, date } = req.body;
  if (!name || !date) return res.status(400).json({ error: "Name and date are required." });

  try {
    await db.query("INSERT INTO events (name, date) VALUES (?, ?)", [name, date]);
    res.status(201).json({ message: "Event added successfully" });
  } catch (err) {
    console.error("Event creation error:", err);
    res.status(500).json({ error: "Server error while adding event" });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM events WHERE date >= CURDATE() ORDER BY date ASC");
    res.json(rows);
  } catch (err) {
    console.error("Fetch events error:", err);
    res.status(500).json({ error: "Server error while fetching events" });
  }
});

// === Projects ===
app.post("/api/projects/upload", upload.single("file"), async (req, res) => {
  const { title, description, eventId, userId } = req.body;
  const file = req.file;

  if (!title || !description || !eventId || !file || !userId)
    return res.status(400).json({ error: "All fields and file are required." });

  try {
    await db.query(
      "INSERT INTO projects (title, description, file_path, event_id, user_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, file.filename, eventId, userId]
    );
    res.status(201).json({ message: "Project uploaded successfully!" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error while uploading project" });
  }
});

app.get("/api/projects/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const [projects] = await db.query(
      `SELECT p.title, p.description, p.file_path AS filename, e.name AS event_name 
       FROM projects p 
       JOIN events e ON p.event_id = e.id 
       WHERE p.user_id = ?`,
      [userId]
    );
    res.json(projects);
  } catch (err) {
    console.error("Failed to fetch user projects:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/projects/event/:eventId", async (req, res) => {
  const { eventId } = req.params;
  try {
    const [projects] = await db.query(
      `SELECT p.id, p.title, p.description, p.file_path AS filename, s.name AS student_name
       FROM projects p
       JOIN students s ON p.user_id = s.id
       WHERE p.event_id = ?`,
      [eventId]
    );
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects for event:", err);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});

// === Reviews ===
app.post("/api/projects/review", async (req, res) => {
  let { judgeId, projectId, creativity, impact, execution, feasibility, design, feedback } = req.body;

  creativity = Number(creativity);
  impact = Number(impact);
  execution = Number(execution);
  feasibility = Number(feasibility);
  design = Number(design);

  if (
    !judgeId || !projectId ||
    isNaN(creativity) || isNaN(impact) || isNaN(execution) || isNaN(feasibility) || isNaN(design)
  ) {
    return res.status(400).json({ error: "All scoring fields must be valid numbers." });
  }

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

app.get("/api/leaderboard/recent", async (req, res) => {
  try {
    const [allEvents] = await db.query("SELECT * FROM events ORDER BY date DESC");
    const topThree = allEvents.slice(0, 3);
    const rest = allEvents.slice(3);

    const formatEventProjects = async (eventList) => {
      const result = [];
      for (let event of eventList) {
        const [projects] = await db.query(`
          SELECT p.title, p.file_path, AVG(r.final_score) AS final_score
          FROM projects p
          JOIN reviews r ON p.id = r.project_id
          WHERE p.event_id = ?
          GROUP BY p.id
          ORDER BY final_score DESC
        `, [event.id]);

        result.push({
          event_id: event.id,
          event_name: event.name,
          date: event.date,
          projects: projects.map((p, index) => ({
            ...p,
            rank: index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null
          }))
        });
      }
      return result;
    };

    const topThreeData = await formatEventProjects(topThree);
    const remainingData = await formatEventProjects(rest);

    res.json({ topThree: topThreeData, others: remainingData });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
