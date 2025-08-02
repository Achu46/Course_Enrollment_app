CREATE DATABASE course_enrollment;

USE course_enrollment;

CREATE TABLE students(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100)
);

CREATE TABLE courses(
	id INT AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(100),
    description TEXT
);

CREATE TABLE enrollment(
	id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    FOREIGN KEY (student_id) REFERENCES students(id),
	FOREIGN KEY (course_id) REFERENCES courses(id)
);

SELECT * FROM students;
SELECT * FROM courses;
SELECT * FROM enrollment;