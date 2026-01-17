-- Add category column to projects table
ALTER TABLE projects ADD COLUMN category VARCHAR(50) NULL AFTER technologies;

-- Update existing projects with default category
UPDATE projects SET category = 'Web App' WHERE category IS NULL;
