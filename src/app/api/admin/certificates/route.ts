import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';

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

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const certificates = await query(
            `SELECT c.*, 
                    a.email as created_by_email,
                    u.email as updated_by_email
             FROM certificates c
             LEFT JOIN admins a ON c.created_by = a.id
             LEFT JOIN admins u ON c.updated_by = u.id
             ORDER BY c.created_at DESC`
        );

        return NextResponse.json({ certificates });
    } catch (error) {
        console.error('Get admin certificates error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch certificates' },
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
        const validation = certificateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const data = validation.data;
        const certId = uuidv4();

        // Check if category column exists
        let hasCategoryColumn = false;
        try {
            interface ColumnDescriptor {
                Field: string;
            }
            const columns = await query<ColumnDescriptor[]>('DESCRIBE certificates');
            hasCategoryColumn = columns.some(col => col.Field === 'category');

            // Auto-migration for category column
            if (!hasCategoryColumn) {
                await query('ALTER TABLE certificates ADD COLUMN category VARCHAR(255) DEFAULT "Certification" AFTER skills');
                hasCategoryColumn = true;
            }
        } catch (e) {
            console.error('Error checking/migrating certificates table schema in POST:', e);
            // Fallback to try inserting anyway or rely on hasCategoryColumn=false
        }

        if (hasCategoryColumn) {
            await query(
                `INSERT INTO certificates 
                 (id, title, issuer, date, credential_url, image_url, images, skills, category, featured, created_by, updated_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    certId,
                    data.title,
                    data.issuer,
                    data.date,
                    data.credential_url || null,
                    data.image_url || null,
                    JSON.stringify(data.images || []),
                    data.skills ? JSON.stringify(data.skills) : null,
                    data.category || 'Certification', // Default category
                    data.featured ? 1 : 0,
                    admin.id,
                    admin.id,
                ]
            );
        } else {
            // Fallback for older schema just in case
            await query(
                `INSERT INTO certificates 
                 (id, title, issuer, date, credential_url, image_url, images, skills, featured, created_by, updated_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    certId,
                    data.title,
                    data.issuer,
                    data.date,
                    data.credential_url || null,
                    data.image_url || null,
                    JSON.stringify(data.images || []),
                    data.skills ? JSON.stringify(data.skills) : null,
                    data.featured ? 1 : 0,
                    admin.id,
                    admin.id,
                ]
            );
        }

        await logActivity(request, String(admin.id), 'CREATE_CERTIFICATE', {
            id: certId,
            title: data.title
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Certificate created successfully',
                certificateId: certId,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Create certificate error:', error);
        return NextResponse.json(
            { error: 'Failed to create certificate' },
            { status: 500 }
        );
    }
}
