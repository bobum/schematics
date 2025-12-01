-- User Preferences Database Schema
-- Creates tables for storing user preferences

CREATE DATABASE IF NOT EXISTS user_preferences_db;
USE user_preferences_db;

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  theme ENUM('light', 'dark', 'auto') DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'en',
  notifications JSON,
  privacy JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for testing
INSERT INTO user_preferences (user_id, theme, language, notifications, privacy) VALUES
('sample-user-1', 'dark', 'en', 
  JSON_OBJECT('email', true, 'push', true, 'sms', false),
  JSON_OBJECT('profileVisibility', 'public', 'showEmail', true, 'showPhone', false)
),
('sample-user-2', 'light', 'es',
  JSON_OBJECT('email', false, 'push', false, 'sms', false),
  JSON_OBJECT('profileVisibility', 'private', 'showEmail', false, 'showPhone', false)
);
