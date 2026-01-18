import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(50),
});

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        // Auto-migration check (lightweight)
        try {
            await query('SELECT 1 FROM certificate_categories LIMIT 1');
        } catch {
            // Table doesn't exist, create it
            await query(`
                CREATE TABLE IF NOT EXISTS certificate_categories (
                    id VARCHAR(36) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    sort_order INT DEFAULT 0
                )
            `);
        }

        const categories = await query('SELECT * FROM certificate_categories ORDER BY sort_order ASC, name ASC');
        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Get certificate categories error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const body = await request.json();
        const validation = categorySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        // Ensure table exists before inserting
        try {
            await query('SELECT 1 FROM certificate_categories LIMIT 1');
        } catch {
            await query(`
                CREATE TABLE IF NOT EXISTS certificate_categories (
                    id VARCHAR(36) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    sort_order INT DEFAULT 0
                )
            `);
        }

        const id = uuidv4();
        await query(
            'INSERT INTO certificate_categories (id, name) VALUES (?, ?)',
            [id, validation.data.name]
        );

        await logActivity(request, authResult.admin.id.toString(), 'CREATE_CERTIFICATE_CATEGORY', { name: validation.data.name });

        return NextResponse.json({ id, name: validation.data.name, message: 'Category created' }, { status: 201 });
    } catch (error) {
        console.error('Create certificate category error:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
