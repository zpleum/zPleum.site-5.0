-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    credential_url VARCHAR(500),
    image_url VARCHAR(500),
    skills JSON,
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
