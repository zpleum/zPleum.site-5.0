-- Profile Settings Database Schema

-- Create profile_settings table
CREATE TABLE IF NOT EXISTS profile_settings (
  id INT PRIMARY KEY DEFAULT 1,
  full_name VARCHAR(200) NOT NULL DEFAULT 'Wiraphat Makwong',
  profile_image_url TEXT NOT NULL DEFAULT '/profile.png',
  email VARCHAR(255) NOT NULL DEFAULT 'wiraphat.makwong@gmail.com',
  github_url VARCHAR(500) NOT NULL DEFAULT 'https://github.com/zPleum',
  linkedin_url VARCHAR(500) NOT NULL DEFAULT 'https://linkedin.com/in/wiraphat-makwong',
  facebook_url VARCHAR(500) NOT NULL DEFAULT 'https://www.facebook.com/wiraphat.makwong',
  instagram_url VARCHAR(500) NOT NULL DEFAULT 'https://www.instagram.com/zpleum.tsx',
  discord_url VARCHAR(500) NOT NULL DEFAULT 'https://discord.com/users/837918998242656267',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed initial data
INSERT INTO profile_settings (id, full_name, profile_image_url, email, github_url, linkedin_url, facebook_url, instagram_url, discord_url) VALUES
  (1, 'Wiraphat Makwong', '/profile.png', 'wiraphat.makwong@gmail.com', 'https://github.com/zPleum', 'https://linkedin.com/in/wiraphat-makwong', 'https://www.facebook.com/wiraphat.makwong', 'https://www.instagram.com/zpleum.tsx', 'https://discord.com/users/837918998242656267')
ON DUPLICATE KEY UPDATE id = id;
