import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Public endpoint to get all projects (no authentication required)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured');
        const category = searchParams.get('category');

        // Check columns first to be safe
        let hasCategoryColumn = false;
        try {
            const columns = await query<any[]>('DESCRIBE projects');
            hasCategoryColumn = columns.some(col => col.Field === 'category');
        } catch (e) {
            console.error('Error checking projects table schema:', e);
        }

        let sql = 'SELECT * FROM projects WHERE 1=1';
        const params: any[] = [];

        if (featured === 'true') {
            sql += ' AND featured = ?';
            params.push(1); // Use 1 for MySQL boolean
        }

        if (hasCategoryColumn && category && category !== 'All') {
            sql += ' AND category = ?';
            params.push(category);
        }

        sql += ' ORDER BY featured DESC, created_at DESC';

        console.log('Fetching projects with SQL:', sql, 'params:', params);
        const projects = await query<any[]>(sql, params);
        console.log('Raw projects found in DB:', projects.length);

        // Parse technologies JSON and handle potential string/object differences
        const formattedProjects = projects.map(project => {
            let techs = [];
            try {
                if (project.technologies) {
                    techs = typeof project.technologies === 'string'
                        ? JSON.parse(project.technologies)
                        : project.technologies;
                }
            } catch (e) {
                console.warn('Error parsing technologies for project:', project.id, e);
                techs = [];
            }

            let images = [];
            try {
                if (project.images) {
                    images = typeof project.images === 'string'
                        ? JSON.parse(project.images)
                        : project.images;
                }
            } catch (e) {
                console.warn('Error parsing images for project:', project.id, e);
                images = [];
            }

            return {
                ...project,
                category: project.category || 'Web App',
                technologies: Array.isArray(techs) ? techs : [],
                images: Array.isArray(images) ? images : [],
            };
        });

        return NextResponse.json({ projects: formattedProjects });
    } catch (error: any) {
        console.error('SERVER ERROR in /api/projects:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch projects',
                message: error.message,
                sqlState: error.sqlState,
                code: error.code
            },
            { status: 500 }
        );
    }
}
