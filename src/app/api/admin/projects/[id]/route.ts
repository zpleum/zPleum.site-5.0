import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query, queryOne } from '@/lib/db';
import { logActivity } from '@/lib/logger';
import fs from 'fs/promises';
import path from 'path';

const updateProjectSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    image_url: z.string().optional(), // Removed .url() to support relative paths
    images: z.array(z.string()).optional(), // Removed .url() to support relative paths
    project_url: z.string().optional().or(z.literal('')),
    github_url: z.string().optional().or(z.literal('')),
    technologies: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    category: z.string().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { id } = await params;

    try {
        const project = await queryOne<any>(
            `SELECT p.*, 
              c.email as created_by_email,
              u.email as updated_by_email
       FROM projects p
       LEFT JOIN admins c ON p.created_by = c.id
       LEFT JOIN admins u ON p.updated_by = u.id
       WHERE p.id = ?`,
            [id]
        );

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error('Get project error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;
    const { id } = await params;

    try {
        const body = await request.json();
        const validation = updateProjectSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const data = validation.data;
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        // Ensure image_url is set if we have new images but no primary image
        // This is a naive heuristic; normally client guarantees consistency
        if (data.images && data.images.length > 0 && !data.image_url) {
            // Optional: logic to set image_url to images[0] could go here if desired
        }

        if (data.title !== undefined) {
            updateFields.push('title = ?');
            updateValues.push(data.title);
        }
        if (data.description !== undefined) {
            updateFields.push('description = ?');
            updateValues.push(data.description);
        }
        if (data.image_url !== undefined) {
            updateFields.push('image_url = ?');
            updateValues.push(data.image_url);
        }
        if (data.images !== undefined) {
            updateFields.push('images = ?');
            updateValues.push(JSON.stringify(data.images));
        }
        if (data.project_url !== undefined) {
            updateFields.push('project_url = ?');
            updateValues.push(data.project_url);
        }
        if (data.github_url !== undefined) {
            updateFields.push('github_url = ?');
            updateValues.push(data.github_url);
        }
        if (data.technologies !== undefined) {
            updateFields.push('technologies = ?');
            updateValues.push(JSON.stringify(data.technologies));
        }
        if (data.featured !== undefined) {
            updateFields.push('featured = ?');
            updateValues.push(data.featured ? 1 : 0);
        }
        if (data.category !== undefined) {
            updateFields.push('category = ?');
            updateValues.push(data.category);
        }

        if (updateFields.length === 0) {
            return NextResponse.json(
                { message: 'No updates provided' },
                { status: 400 }
            );
        }

        updateFields.push('updated_by = ?');
        updateValues.push(admin.id);
        updateValues.push(id);

        // Auto-migration: Check if category column exists and add it if missing
        try {
            const columns = await query<any[]>('DESCRIBE projects');
            const hasCategoryColumn = columns.some(col => col.Field === 'category');
            if (!hasCategoryColumn) {
                await query("ALTER TABLE projects ADD COLUMN category VARCHAR(50) DEFAULT 'Web App' AFTER technologies");
            }
        } catch (e) {
            console.error('Schema check error:', e);
        }

        await query(
            `UPDATE projects SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        await logActivity(request, admin.id, 'UPDATE_PROJECT', {
            id,
            title: data.title
        });

        return NextResponse.json({
            success: true,
            message: 'Project updated successfully',
        });
    } catch (error) {
        console.error('Update project error:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { id } = await params;

    try {
        // 1. Fetch project to get image paths
        const project = await queryOne<any>('SELECT * FROM projects WHERE id = ?', [id]);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // 2. Delete main image
        if (project.image_url) {
            try {
                const filename = project.image_url.split('/').pop();
                if (filename) {
                    const filepath = path.join(process.cwd(), 'public', 'projects', filename);
                    await fs.unlink(filepath).catch((err) => {
                        console.warn(`Failed to delete main image: ${filepath}`, err);
                    });
                }
            } catch (e) {
                console.warn('Error processing main image deletion', e);
            }
        }

        // 3. Delete additional images
        let additionalImages: string[] = [];
        try {
            if (project.images) {
                additionalImages = typeof project.images === 'string'
                    ? JSON.parse(project.images)
                    : project.images;

                if (Array.isArray(additionalImages)) {
                    for (const imgUrl of additionalImages) {
                        if (imgUrl && imgUrl !== project.image_url) {
                            try {
                                const filename = imgUrl.split('/').pop();
                                if (filename) {
                                    const filepath = path.join(process.cwd(), 'public', 'projects', filename);
                                    await fs.unlink(filepath).catch((err) => {
                                        console.warn(`Failed to delete additional image: ${filepath}`, err);
                                    });
                                }
                            } catch (e) {
                                console.warn(`Error processing additional image deletion: ${imgUrl}`, e);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('Error parsing additional images for deletion', e);
        }

        // 4. Delete from Database
        await query('DELETE FROM projects WHERE id = ?', [id]);

        await logActivity(request, authResult.admin.id, 'DELETE_PROJECT', { id });

        return NextResponse.json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        console.error('Delete project error:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
