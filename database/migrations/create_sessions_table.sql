-- Sessions Table for Server-Side Session Management

CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(64) PRIMARY KEY,
  admin_id INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  INDEX idx_admin_id (admin_id),
  INDEX idx_expires_at (expires_at)
);

-- Add encrypted TOTP secret column to admins table
ALTER TABLE admins 
ADD COLUMN totp_secret_encrypted TEXT AFTER totp_secret;

-- Cleanup expired sessions (run periodically)
-- DELETE FROM sessions WHERE expires_at < NOW();
