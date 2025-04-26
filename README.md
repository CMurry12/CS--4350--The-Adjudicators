# CS--4350--The-Adjudicators

Project title: Judging App  
Group name: The Adjudicators  
Team members: Charles Murry, Aiba Diane, Ayomide Onafowokan, Edith Sanchez, Samual Holison  


 Overview
The Adjudicators is a complete web application that simplifies judging for student competitions. It supports three main user roles—students, judges, and admins—allowing seamless project submissions, scoring, event management, and leaderboard viewing.

file:///Users/aibadiane/Documents/html%20practice%20website/CS--4350--The-Adjudicators/JudgingApp/public/index.html

🚀 How to Run the Project
1. Clone or Extract
Download and unzip the project folder or clone it using Git.

2. Install Dependencies
From the root directory, run:

bash
Copy
Edit
npm install
3. Set Up the Database
Create a MySQL database.

Run the SQL schema file:

bash
Copy
Edit
mysql -u yourusername -p yourdatabase < schema.sql
Update the database connection in db.js:

js
Copy
Edit
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'yourusername',
  password: 'yourpassword',
  database: 'judging_app'
});
4. Start the Server
bash
Copy
Edit
node server.js
5. Open in Browser
Navigate to:

bash
Copy
Edit
http://localhost:3000/public/index.html
🔑 Key Features
👩‍🎓 Students
Register/Login

Submit projects (projects.html)

View submitted projects (student-dashboard.html)

View leaderboard (Leaderboard.html)

👨‍⚖️ Judges
Login

View assigned events (judge-events.html)

Score projects (judge-scoring.html)

View results (leaderboard-judge.html)

👨‍💼 Admins
Login

Create and manage:

Events (admin-events.html)

Judges (admin-judges.html)

Projects (admin-projects.html)

Analytics (admin-analytics.html)

📁 Project Structure
pgsql
Copy
Edit
JudgingApp/
│
├── public/
│   ├── HTML files (e.g. index.html, register.html, student.html, etc.)
│   ├── JavaScript (admin.js, judge.js, auth.js)
│   ├── styles.css
│
├── testing/
│   └── (test-related files if any)
│
├── db.js             # MySQL connection setup
├── server.js         # Backend API using Express
├── schema.sql        # SQL schema to initialize DB
├── package.json
└── README.md
📦 Dependencies
express

mysql2

cors

multer (for file uploads)

body-parser (optional)

dotenv (optional for environment variables)

✅ Final Setup Checklist
 Install dependencies with npm install

 Set up and import schema.sql into MySQL

 Configure your database in db.js

 Start the server with node server.js

 Open http://localhost:3000/public/index.html in your browser
