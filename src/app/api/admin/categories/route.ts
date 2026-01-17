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
        const categories = await query('SELECT * FROM categories ORDER BY sort_order ASC, name ASC');
        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
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

        const id = uuidv4();
        await query(
            'INSERT INTO categories (id, name) VALUES (?, ?)',
            [id, validation.data.name]
        );

        await logActivity(request, (authResult as { admin: any }).admin.id, 'CREATE_CATEGORY', { name: validation.data.name });

        return NextResponse.json(
            { success: true, message: 'Category created', id },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
        }
        console.error('Create category error:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
