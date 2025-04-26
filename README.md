# CS--4350--The-Adjudicators

Project title: Judging App  
Group name: The Adjudicators  
Team members: Charles Murry, Aiba Diane, Ayomide Onafowokan, Edith Sanchez, Samual Holison  

📌 Overview
The Adjudicators is a full-featured web app designed for college project judging. It includes user roles for students, judges, and admins, and allows project submissions, scoring, event management, and leaderboard access.

🌐 Live Deployment
The backend is hosted on Render:
🔗 API Base URL: https://judgingapp-97rm.onrender.com

🚀 How to Run Locally (Optional)
1. Install Dependencies
bash
Copy
Edit
npm install
2. Set Up the Database (Local Only)
If you're using the hosted backend, you can skip this.

bash
Copy
Edit
mysql -u yourusername -p yourdatabase < schema.sql
Update db.js if running locally:

js
Copy
Edit
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'yourusername',
  password: 'yourpassword',
  database: 'judging_app'
});
3. Start the Server
bash
Copy
Edit
node server.js
🔑 Features by Role
👨‍🎓 Students
Register/Login

Submit projects (projects.html)

View own submissions (student-dashboard.html)

View leaderboard (Leaderboard.html)

Update profile (profile.html)

👨‍⚖️ Judges
Login/Register

Score assigned projects (judge-scoring.html)

View event details (judge-events.html)

View leaderboard (leaderboard-judge.html)

Judge dashboard (judge-dashboard.html)

👩‍💼 Admins
Login

Manage events (admin-events.html)

Manage judges (admin-judges.html)

Manage projects (admin-projects.html)

View analytics (admin-analytics.html)

Admin dashboard (admin-dashboard.html)

📂 Project Structure
pgsql
Copy
Edit
JudgingApp/
│
├── public/
│   ├── HTML files (all views)
│   ├── JS files (auth.js, admin.js, judge.js)
│   └── styles.css
│
├── schema.sql
├── db.js
├── server.js
├── package.json
└── README.md
📦 Dependencies
express

mysql2

cors

multer (for file upload)

body-parser (optional)

dotenv (optional)

📝 Usage
Open public/index.html in the browser.

All requests will interact with the hosted API at https://judgingapp-97rm.onrender.com.
