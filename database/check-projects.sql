-- First, check if category column exists
DESCRIBE projects;

-- Check all projects in database
SELECT id, title, category, featured, created_at FROM projects;

-- Count total projects
SELECT COUNT(*) as total_projects FROM projects;
