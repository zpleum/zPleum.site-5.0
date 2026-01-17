-- Stats Management System Database Schema

-- Create stats table
CREATE TABLE IF NOT EXISTS stats (
  id VARCHAR(36) PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT 'Briefcase',
  color VARCHAR(50) NOT NULL DEFAULT 'blue',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial data
INSERT INTO stats (id, label, value, icon, color, display_order) VALUES
  (UUID(), 'Experience', '5+ Years', 'Briefcase', 'blue', 0),
  (UUID(), 'Projects', '10+ Built', 'Code', 'purple', 1),
  (UUID(), 'Satisfaction', '100%', 'Heart', 'pink', 2);
