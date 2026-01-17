import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const categories = await query<any[]>(
            `SELECT * FROM skill_categories ORDER BY display_order ASC`
        );

        const categoriesWithSkills = await Promise.all(
            categories.map(async (category) => {
                const skills = await query<any[]>(
                    `SELECT * FROM skills WHERE category_id = ? ORDER BY display_order ASC`,
                    [category.id]
                );

                return {
                    ...category,
                    skills
                };
            })
        );

        return NextResponse.json({ categories: categoriesWithSkills });
    } catch (error) {
        console.error('Error fetching skill categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skill categories' },
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
        const { title, icon = 'Terminal', color = 'blue' } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const id = uuidv4();

        // Get max display_order
        const maxOrder = await query<any[]>(
            `SELECT MAX(display_order) as max_order FROM skill_categories`
        );
        const displayOrder = (maxOrder[0]?.max_order ?? -1) + 1;

        await query(
            `INSERT INTO skill_categories (id, title, icon, color, display_order) VALUES (?, ?, ?, ?, ?)`,
            [id, title, icon, color, displayOrder]
        );

        await logActivity(request, admin.id, 'CREATE_SKILL_CATEGORY', { id, title });

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('Error creating skill category:', error);
        return NextResponse.json(
            { error: 'Failed to create skill category' },
            { status: 500 }
        );
    }
}
