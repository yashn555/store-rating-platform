-- =============================================
-- Store Rating Platform - Database Schema
-- =============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS internship_db;
USE internship_db;

-- =============================================
-- Users Table
-- =============================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    role ENUM('user', 'owner', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- =============================================
-- Stores Table
-- =============================================
DROP TABLE IF EXISTS stores;
CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    address TEXT,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_owner (owner_id),
    INDEX idx_email (email)
);

-- =============================================
-- Ratings Table
-- =============================================
DROP TABLE IF EXISTS ratings;
CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store (user_id, store_id),
    INDEX idx_user (user_id),
    INDEX idx_store (store_id),
    INDEX idx_rating (rating)
);

-- =============================================
-- Sample Data (Optional - for testing)
-- =============================================

-- Insert Admin User (password: Password@123)
-- Note: Password is hashed using bcrypt
INSERT INTO users (name, email, password, address, role) VALUES
('Admin User Twenty Character Name', 'admin@example.com', '$2b$10$YourHashedPasswordHere', '123 Admin Street, City, Country', 'admin');

-- Insert Owner User
INSERT INTO users (name, email, password, address, role) VALUES
('Owner User Twenty Character Name', 'owner@example.com', '$2b$10$YourHashedPasswordHere', '456 Owner Avenue, City, Country', 'owner');

-- Insert Regular User
INSERT INTO users (name, email, password, address, role) VALUES
('Regular User Twenty Character Name', 'user@example.com', '$2b$10$YourHashedPasswordHere', '789 User Road, City, Country', 'user');

-- Insert Sample Stores
INSERT INTO stores (name, email, address, owner_id) VALUES
('Tech Solutions Store', 'contact@techsolutions.com', '123 Tech Park, Silicon Valley, CA 94025', 2),
('Fashion Hub Boutique', 'info@fashionhub.com', '456 Fashion Ave, New York, NY 10001', 2),
('Coffee Shop Downtown', 'coffee@downtown.com', '789 Coffee Lane, Downtown, USA', 2);

-- =============================================
-- Stored Procedure: Get Store Average Rating
-- =============================================
DELIMITER //
CREATE PROCEDURE GetStoreAverageRating(IN storeId INT)
BEGIN
    SELECT 
        s.id,
        s.name,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE s.id = storeId
    GROUP BY s.id;
END //
DELIMITER ;

-- =============================================
-- Stored Procedure: Get User Rating History
-- =============================================
DELIMITER //
CREATE PROCEDURE GetUserRatings(IN userId INT)
BEGIN
    SELECT 
        r.id,
        s.name as store_name,
        r.rating,
        r.created_at as rated_at
    FROM ratings r
    JOIN stores s ON r.store_id = s.id
    WHERE r.user_id = userId
    ORDER BY r.created_at DESC;
END //
DELIMITER ;

-- =============================================
-- View: Admin Dashboard Summary
-- =============================================
CREATE OR REPLACE VIEW admin_dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM stores) as total_stores,
    (SELECT COUNT(*) FROM ratings) as total_ratings,
    (SELECT COUNT(*) FROM users WHERE role = 'user') as normal_users,
    (SELECT COUNT(*) FROM users WHERE role = 'owner') as store_owners,
    (SELECT COUNT(*) FROM users WHERE role = 'admin') as admins;

-- =============================================
-- Indexes for Performance Optimization
-- =============================================
-- Additional indexes for better query performance
CREATE INDEX idx_ratings_rating ON ratings(rating);
CREATE INDEX idx_ratings_created ON ratings(created_at);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_users_name ON users(name);

-- =============================================
-- End of Database Schema
-- =============================================
