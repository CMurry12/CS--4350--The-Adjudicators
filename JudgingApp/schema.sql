-- 1. Create judges table
CREATE TABLE judges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judgeId VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- 2. Create students table
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- 3. Create events table
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  date DATE
);

-- 4. Now create projects table
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(255),
  event_id INT,
  user_id INT,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (user_id) REFERENCES students(id)
);
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judge_id INT,
  project_id INT,
  creativity INT,
  impact INT,
  execution INT,
  feasibility INT,
  design INT,
  final_score DECIMAL(5,2),
  feedback TEXT,
  FOREIGN KEY (judge_id) REFERENCES judges(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
