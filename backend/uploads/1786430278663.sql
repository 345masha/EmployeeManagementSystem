CREATE DATABASE IF NOT EXISTS hospital_queue_system;
USE hospital_queue_system;

CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Doctor', 'Receptionist', 'Patient') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS Patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    department_id INT,
    specialization VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES Departments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('Scheduled', 'Arrived', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    queue_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(id) ON DELETE CASCADE
);

-- Insert Default Admin User (Password is 'admin123' - you will hash this in real app)
-- INSERT INTO Users (name, email, password, role) VALUES ('System Admin', 'admin@hospital.com', '$2b$10$xyz...', 'Admin');
