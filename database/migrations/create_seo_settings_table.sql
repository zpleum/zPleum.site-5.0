CREATE TABLE IF NOT EXISTS seo_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_title VARCHAR(255) NOT NULL,
    site_description TEXT,
    keywords TEXT,
    og_image VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Initialize with default values
INSERT INTO seo_settings (id, site_title, site_description, keywords, og_image)
VALUES (1, 'zPleum - Full Stack Developer', 'Portfolio of Wiraphat Makwong, aka Pleum, Full Stack Developer', 'developer, portfolio, nextjs, typescript, engineering', '/og-image.jpg')
ON DUPLICATE KEY UPDATE id=id;
