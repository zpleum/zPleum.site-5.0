import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query, queryOne } from '@/lib/db';
import { logActivity } from '@/lib/logger';
import { deleteFromR2 } from '@/lib/s3';

const certificateSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    date: z.string().min(1, 'Date is required'),
    credential_url: z.string().optional().or(z.literal('')),
    image_url: z.string().optional().or(z.literal('')),
    images: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    category: z.string().optional(),
});

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;

    try {
        const certificate = await queryOne(
            'SELECT * FROM certificates WHERE id = ?',
            [id]
        );

        if (!certificate) {
            return NextResponse.json(
                { error: 'Certificate not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ certificate });
    } catch (error) {
        console.error('Get certificate error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch certificate' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { admin } = authResult;
    const { id } = await context.params;

    try {
        const body = await request.json();
        const validation = certificateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Fetch existing certificate to handle image deletion
        const originalCert = await queryOne('SELECT image_url, images FROM certificates WHERE id = ?', [id]) as { image_url: string | null; images: string | null } | undefined;

        if (originalCert) {
            let oldImages: string[] = [];
            try {
                oldImages = typeof originalCert.images === 'string'
                    ? JSON.parse(originalCert.images)
                    : originalCert.images || [];
            } catch (e) {
                console.error("Error parsing old images", e);
            }

            if (originalCert.image_url) {
                oldImages.push(originalCert.image_url);
            }

            const newImagesString = JSON.stringify(data.images || []);
            const newImagesList = data.images || [];
            if (data.image_url) {
                newImagesList.push(data.image_url);
            }

            // Find images that are in oldImages but NOT in newImagesList
            const removedImages = oldImages.filter(img => !newImagesList.includes(img));

            // Delete removed images from R2
            for (const imgUrl of removedImages) {
                if (imgUrl && imgUrl.startsWith('https://')) { // Basic check to avoid deleting local placeholders if any
                    await deleteFromR2(imgUrl);
                }
            }
        }

        // Check if category column exists
        let hasCategoryColumn = false;
        try {
            interface ColumnDescriptor {
                Field: string;
            }
            const columns = await query<ColumnDescriptor[]>('DESCRIBE certificates');
            hasCategoryColumn = columns.some(col => col.Field === 'category');
        } catch (e) {
            console.error('Error checking certificates table schema in PUT:', e);
        }

        if (hasCategoryColumn) {
            await query(
                `UPDATE certificates 
                 SET title = ?, issuer = ?, date = ?, credential_url = ?, image_url = ?, 
                     images = ?, skills = ?, category = ?, featured = ?, updated_by = ?
                 WHERE id = ?`,
                [
                    data.title,
                    data.issuer,
                    data.date,
                    data.credential_url || null,
                    data.image_url || null,
                    JSON.stringify(data.images || []),
                    data.skills ? JSON.stringify(data.skills) : null,
                    data.category || 'Certification',
                    data.featured ? 1 : 0,
                    admin.id,
                    id,
                ]
            );
        } else {
            await query(
                `UPDATE certificates 
                 SET title = ?, issuer = ?, date = ?, credential_url = ?, image_url = ?, 
                     images = ?, skills = ?, featured = ?, updated_by = ?
                 WHERE id = ?`,
                [
                    data.title,
                    data.issuer,
                    data.date,
                    data.credential_url || null,
                    data.image_url || null,
                    JSON.stringify(data.images || []),
                    data.skills ? JSON.stringify(data.skills) : null,
                    data.featured ? 1 : 0,
                    admin.id,
                    id,
                ]
            );
        }

        await logActivity(request, String(admin.id), 'UPDATE_CERTIFICATE', {
            id,
            title: data.title
        });

        return NextResponse.json({
            success: true,
            message: 'Certificate updated successfully'
        });
    } catch (error) {
        console.error('Update certificate error:', error);
        return NextResponse.json(
            { error: 'Failed to update certificate' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { admin } = authResult;
    const { id } = await context.params;

    try {
        await query('DELETE FROM certificates WHERE id = ?', [id]);

        await logActivity(request, String(admin.id), 'DELETE_CERTIFICATE', { id });

        return NextResponse.json({
            success: true,
            message: 'Certificate deleted successfully'
        });
    } catch (error) {
        console.error('Delete certificate error:', error);
        return NextResponse.json(
            { error: 'Failed to delete certificate' },
            { status: 500 }
        );
    }
}
