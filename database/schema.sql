CREATE DATABASE IF NOT EXISTS amex_training;
USE amex_training;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'trainer', 'trainee') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default admin account
INSERT IGNORE INTO users (name, email, password_hash, role) 
VALUES ('System Administrator', 'admin@amex.com', '$2b$10$w1K5UBiUacQXKMac6fzyZOqANskBVwX4GhLsshdisOkpNCFc4Z1Wi', 'admin');

CREATE TABLE IF NOT EXISTS training_programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    trainer_id INT NOT NULL,
    target_audience VARCHAR(255) NOT NULL,
    schedule_date DATETIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS program_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deleted_programs (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    trainer_id INT NOT NULL,
    target_audience VARCHAR(255) NOT NULL,
    schedule_date DATETIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    description TEXT,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
