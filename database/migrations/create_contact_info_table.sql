-- Contact Information Database Schema

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id INT PRIMARY KEY DEFAULT 1,
  email VARCHAR(255) NOT NULL DEFAULT 'wiraphat.makwong@gmail.com',
  location VARCHAR(255) NOT NULL DEFAULT 'Bangkok, Thailand',
  github_url VARCHAR(500) NOT NULL DEFAULT 'https://github.com/zPleum',
  facebook_url VARCHAR(500) NOT NULL DEFAULT 'https://www.facebook.com/wiraphat.makwong',
  discord_url VARCHAR(500) NOT NULL DEFAULT 'https://discord.com/users/837918998242656267',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed initial data
INSERT INTO contact_info (id, email, location, github_url, facebook_url, discord_url) VALUES
  (1, 'wiraphat.makwong@gmail.com', 'Bangkok, Thailand', 'https://github.com/zPleum', 'https://www.facebook.com/wiraphat.makwong', 'https://discord.com/users/837918998242656267')
ON DUPLICATE KEY UPDATE id = id;
