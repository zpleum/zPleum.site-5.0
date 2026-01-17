-- Journey Timeline Management System Database Schema

-- Create journey_milestones table
CREATE TABLE IF NOT EXISTS journey_milestones (
  id VARCHAR(36) PRIMARY KEY,
  year VARCHAR(20) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  align VARCHAR(10) NOT NULL DEFAULT 'left',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial data
INSERT INTO journey_milestones (id, year, title, description, align, display_order) VALUES
  (UUID(), '2022', 'GENESIS', 'Initiated my journey into the digital realm, mastering Python and CLI automation. Built the foundation of my engineering mindset through rigorous self-study and experimentation.', 'left', 0),
  (UUID(), '2023', 'WEB EVOLUTION', 'Transitioned into full-stack development. Mastered the React ecosystem and modern JavaScript frameworks, focusing on building reactive, data-driven interfaces.', 'right', 1),
  (UUID(), '2024', 'ENTERPRISE SCALING', 'Launched Bonniecraft and zPleumCORE. Focused on high-concurrency systems, security protocols, and scalable cloud architectures for enterprise-grade applications.', 'left', 2),
  (UUID(), '2025+', 'NEXT HORIZON', 'Pushing the boundaries with AI integration and sophisticated Cloud-Native solutions. Architecting the next generation of secure, intelligent digital ecosystems.', 'right', 3);
