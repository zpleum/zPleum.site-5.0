-- Skills Management System Database Schema

-- Create skill_categories table
CREATE TABLE IF NOT EXISTS skill_categories (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT 'Terminal',
  color VARCHAR(50) NOT NULL DEFAULT 'blue',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id VARCHAR(36) PRIMARY KEY,
  category_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE CASCADE
);

-- Seed initial data from existing hardcoded skills
INSERT INTO skill_categories (id, title, icon, color, display_order) VALUES
  (UUID(), 'Core Stack', 'Terminal', 'blue', 0),
  (UUID(), 'Databases & Tools', 'Cpu', 'purple', 1),
  (UUID(), 'Deployment', 'Globe', 'pink', 2);

-- Get the IDs for seeding skills
SET @core_id = (SELECT id FROM skill_categories WHERE title = 'Core Stack');
SET @db_id = (SELECT id FROM skill_categories WHERE title = 'Databases & Tools');
SET @deploy_id = (SELECT id FROM skill_categories WHERE title = 'Deployment');

-- Seed skills for Core Stack
INSERT INTO skills (id, category_id, name, display_order) VALUES
  (UUID(), @core_id, 'TypeScript', 0),
  (UUID(), @core_id, 'Next.js', 1),
  (UUID(), @core_id, 'React', 2),
  (UUID(), @core_id, 'Node.js', 3),
  (UUID(), @core_id, 'Tailwind CSS', 4);

-- Seed skills for Databases & Tools
INSERT INTO skills (id, category_id, name, display_order) VALUES
  (UUID(), @db_id, 'MySQL', 0),
  (UUID(), @db_id, 'Prisma', 1),
  (UUID(), @db_id, 'Docker', 2),
  (UUID(), @db_id, 'Git', 3),
  (UUID(), @db_id, 'REST APIs', 4);

-- Seed skills for Deployment
INSERT INTO skills (id, category_id, name, display_order) VALUES
  (UUID(), @deploy_id, 'Vercel', 0),
  (UUID(), @deploy_id, 'AWS', 1),
  (UUID(), @deploy_id, 'Nginx', 2),
  (UUID(), @deploy_id, 'Linux', 3),
  (UUID(), @deploy_id, 'CI/CD', 4);
