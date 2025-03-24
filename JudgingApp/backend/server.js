const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/login', (req, res) => {
  const { userId } = req.body;

  const sql = 'SELECT Role FROM USERS WHERE UserID = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ role: results[0].Role });
  });
});

app.post('/api/register', (req, res) => {
  const { fullName, email, password, role } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO USERS (FullName, Email, Role, Password) VALUES (?, ?, ?, ?)';
  db.query(sql, [fullName, email, role, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: 'User registered successfully', userId: result.insertId });
  });
});

app.post('/api/events', (req, res) => {
  const { name, date, location, level, status } = req.body;

  const sql = `INSERT INTO EVENTS (Name, Date, Location, Level, Status)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [name, date, location, level, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: 'Event created', eventId: result.insertId });
  });
});

app.post('/api/projects', (req, res) => {
  const { title, description, userId, eventId } = req.body;

  const sql = `INSERT INTO PROJECTS (Title, Description, FK_User_ID, FK_Event_ID)
               VALUES (?, ?, ?, ?)`;

  db.query(sql, [title, description, userId, eventId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: 'Project created', projectId: result.insertId });
  });
});

app.get('/api/events', (req, res) => {
  const sql = 'SELECT * FROM EVENTS';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
