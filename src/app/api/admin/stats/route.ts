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
        const stats = await query<any[]>(
            `SELECT * FROM stats ORDER BY display_order ASC`
        );

        return NextResponse.json({ stats });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
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
        const { label, value, icon = 'Briefcase', color = 'blue' } = body;

        if (!label || !value) {
            return NextResponse.json(
                { error: 'Label and value are required' },
                { status: 400 }
            );
        }

        const id = uuidv4();

        const maxOrder = await query<any[]>(
            `SELECT MAX(display_order) as max_order FROM stats`
        );
        const displayOrder = (maxOrder[0]?.max_order ?? -1) + 1;

        await query(
            `INSERT INTO stats (id, label, value, icon, color, display_order) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, label, value, icon, color, displayOrder]
        );

        await logActivity(request, admin.id, 'CREATE_STAT', { id, label });

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('Error creating stat:', error);
        return NextResponse.json(
            { error: 'Failed to create stat' },
            { status: 500 }
        );
    }
}
