CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity ENUM('info', 'warning', 'critical') DEFAULT 'info',
    status ENUM('investigating', 'identified', 'monitoring', 'resolved') DEFAULT 'investigating',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_started_at ON incidents(started_at);
