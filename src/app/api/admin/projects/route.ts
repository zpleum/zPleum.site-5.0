import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';

const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    image_url: z.string().optional(), // Removed .url() to support relative paths
    images: z.array(z.string()).optional(), // Removed .url() to support relative paths
    project_url: z.string().optional().or(z.literal('')), // Accept empty string
    github_url: z.string().optional().or(z.literal('')), // Accept empty string
    technologies: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    category: z.string().optional(),
});

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        interface ProjectWithAdmins {
            id: string;
            title: string;
            description: string | null;
            image_url: string | null;
            images: string | null; // JSON string
            project_url: string | null;
            github_url: string | null;
            technologies: string | null; // JSON string
            category: string;
            featured: number | boolean;
            created_by: string;
            updated_by: string;
            created_at: Date | string;
            updated_at: Date | string;
            created_by_email: string | null;
            updated_by_email: string | null;
        }

        const projects = await query<ProjectWithAdmins[]>(
            `SELECT p.*, 
              c.email as created_by_email,
              u.email as updated_by_email
       FROM projects p
       LEFT JOIN admins c ON p.created_by = c.id
       LEFT JOIN admins u ON p.updated_by = u.id
       ORDER BY p.created_at DESC`
        );

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Get admin projects error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;

    try {
        const body = await request.json();
        const validation = projectSchema.safeParse(body);

        if (!validation.success) {
            console.error('Validation error:', validation.error.issues);
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const data = validation.data;
        const projectId = uuidv4();

        // Check if category and images columns exist
        let hasCategoryColumn = false;
        let hasImagesColumn = false;
        try {
            interface ColumnDescriptor {
                Field: string;
                Type: string;
                Null: string;
                Key: string;
                Default: string | null;
                Extra: string;
            }
            const columns = await query<ColumnDescriptor[]>('DESCRIBE projects');
            hasCategoryColumn = columns.some(col => col.Field === 'category');
            hasImagesColumn = columns.some(col => col.Field === 'images');

            // Auto-migration for images column
            if (!hasImagesColumn) {
                await query('ALTER TABLE projects ADD COLUMN images JSON AFTER image_url');
                hasImagesColumn = true;
            }
        } catch (e) {
            console.error('Error checking projects table schema in POST:', e);
        }

        if (hasCategoryColumn) {
            await query(
                `INSERT INTO projects 
           (id, title, description, image_url, images, project_url, github_url, technologies, category, featured, created_by, updated_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    projectId,
                    data.title,
                    data.description || null,
                    data.image_url || null,
                    data.images ? JSON.stringify(data.images) : null,
                    data.project_url || null,
                    data.github_url || null,
                    data.technologies ? JSON.stringify(data.technologies) : null,
                    data.category || 'Web App',
                    data.featured ? 1 : 0,
                    admin.id,
                    admin.id,
                ]
            );
        } else {
            // Fallback for older schema
            await query(
                `INSERT INTO projects 
           (id, title, description, image_url, project_url, github_url, technologies, featured, created_by, updated_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    projectId,
                    data.title,
                    data.description || null,
                    data.image_url || null,
                    data.project_url || null,
                    data.github_url || null,
                    data.technologies ? JSON.stringify(data.technologies) : null,
                    data.featured ? 1 : 0,
                    admin.id,
                    admin.id,
                ]
            );
        }

        await logActivity(request, String(admin.id), 'CREATE_PROJECT', {
            id: projectId,
            title: data.title
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Project created successfully',
                projectId,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        const err = error as { message?: string; sql?: string };
        console.error('Create project error:', error);
        return NextResponse.json(
            {
                error: 'Failed to create project',
                message: err.message,
                sql: err.sql
            },
            { status: 500 }
        );
    }
}
