-- ============================================
-- Admin Authentication System - Complete Setup
-- ============================================

-- Create database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS zpleum_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE zpleum_db;

-- ============================================
-- Drop existing tables (if you want to reset)
-- ============================================
-- Uncomment these lines if you want to reset the database
-- DROP TABLE IF EXISTS admin_backup_codes;
-- DROP TABLE IF EXISTS admin_sessions;
-- DROP TABLE IF EXISTS projects;
-- DROP TABLE IF EXISTS admins;

-- ============================================
-- Create Tables
-- ============================================

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_2fa_enabled BOOLEAN DEFAULT FALSE,
    totp_secret_encrypted TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
    id VARCHAR(36) PRIMARY KEY,
    admin_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_refresh_token_hash (refresh_token_hash),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin backup codes table (for 2FA recovery)
CREATE TABLE IF NOT EXISTS admin_backup_codes (
    id VARCHAR(36) PRIMARY KEY,
    admin_id VARCHAR(36) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_code_hash (code_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects table (enhanced with admin tracking)
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    images JSON,
    project_url VARCHAR(500),
    github_url VARCHAR(500),
    technologies JSON,
    category VARCHAR(50) DEFAULT 'Web App',
    featured BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_featured (featured),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Verify Tables Created
-- ============================================
SHOW TABLES;

-- ============================================
-- Display Table Structures
-- ============================================
DESCRIBE admins;
DESCRIBE admin_sessions;
DESCRIBE admin_backup_codes;
DESCRIBE projects;
