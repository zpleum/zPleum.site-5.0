import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query, queryOne } from '@/lib/db';
import { logActivity } from '@/lib/logger';
import { deleteFromR2 } from '@/lib/s3';

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
        interface ProjectWithAdmins {
            id: string;
            title: string;
            description: string | null;
            image_url: string | null;
            images: string | string[] | null;
            project_url: string | null;
            github_url: string | null;
            technologies: string | string[] | null;
            category: string;
            featured: number | boolean;
            created_by: string;
            updated_by: string;
            created_at: Date | string;
            updated_at: Date | string;
            created_by_email: string | null;
            updated_by_email: string | null;
        }

        const project = await queryOne<ProjectWithAdmins>(
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
        const updateValues: unknown[] = [];

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
            interface ColumnDescriptor {
                Field: string;
                Type: string;
                Null: string;
                Key: string;
                Default: string | null;
                Extra: string;
            }
            const columns = await query<ColumnDescriptor[]>('DESCRIBE projects');
            const hasCategoryColumn = columns.some(col => col.Field === 'category');
            if (!hasCategoryColumn) {
                await query("ALTER TABLE projects ADD COLUMN category VARCHAR(50) DEFAULT 'Web App' AFTER technologies");
            }
        } catch (e) {
            console.error('Schema check error:', e);
        }

        // 1. Fetch current project to comparison images
        const currentProject = await queryOne<{ images: string | string[] | null; image_url: string | null }>(
            'SELECT images, image_url FROM projects WHERE id = ?',
            [id]
        );

        if (currentProject) {
            // Handle images array comparison
            if (data.images !== undefined) {
                let oldImages: string[] = [];
                try {
                    if (currentProject.images) {
                        oldImages = typeof currentProject.images === 'string'
                            ? JSON.parse(currentProject.images)
                            : currentProject.images;
                    }
                } catch (e) {
                    console.error('Error parsing old images:', e);
                }

                if (Array.isArray(oldImages)) {
                    // Find images that were in the old list but NOT in the new list
                    const removedImages = oldImages.filter(img => !data.images?.includes(img));

                    for (const imgUrl of removedImages) {
                        if (imgUrl && imgUrl.startsWith('http')) {
                            try {
                                await deleteFromR2(imgUrl);
                            } catch (e) {
                                console.warn(`Failed to delete removed image from R2: ${imgUrl}`, e);
                            }
                        }
                    }
                }
            }

            // Handle image_url change
            if (data.image_url !== undefined && currentProject.image_url && currentProject.image_url !== data.image_url) {
                // Only delete if it's not being used in the new images gallery either
                const isStillInGallery = data.images?.includes(currentProject.image_url);
                if (!isStillInGallery && currentProject.image_url.startsWith('http')) {
                    try {
                        await deleteFromR2(currentProject.image_url);
                    } catch (e) {
                        console.warn(`Failed to delete old main image from R2: ${currentProject.image_url}`, e);
                    }
                }
            }
        }

        await query(
            `UPDATE projects SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        await logActivity(request, String(admin.id), 'UPDATE_PROJECT', {
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
        interface ProjectRow {
            id: string;
            image_url: string | null;
            images: string | string[] | null;
        }

        // 1. Fetch project to get image paths
        const project = await queryOne<ProjectRow>('SELECT id, image_url, images FROM projects WHERE id = ?', [id]);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // 2. Delete main image
        if (project.image_url && project.image_url.startsWith('http')) {
            try {
                await deleteFromR2(project.image_url);
            } catch (e) {
                console.warn(`Failed to delete main image from R2: ${project.image_url}`, e);
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
                        if (imgUrl && imgUrl.startsWith('http')) {
                            try {
                                await deleteFromR2(imgUrl);
                            } catch (e) {
                                console.warn(`Failed to delete additional image from R2: ${imgUrl}`, e);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('Error processing additional images for deletion', e);
        }

        // 4. Delete from Database
        await query('DELETE FROM projects WHERE id = ?', [id]);

        await logActivity(request, String(authResult.admin.id), 'DELETE_PROJECT', { id });

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
