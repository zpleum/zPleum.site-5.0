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
        interface Milestone {
            id: string;
            year: string | number;
            title: string;
            description: string;
            align: 'left' | 'right';
            display_order: number;
        }

        const milestones = await query<Milestone[]>(
            `SELECT * FROM journey_milestones ORDER BY display_order ASC`
        );

        return NextResponse.json({ milestones });
    } catch (error) {
        console.error('Error fetching journey milestones:', error);
        return NextResponse.json(
            { error: 'Failed to fetch journey milestones' },
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
        const { year, title, description, align = 'left' } = body;

        if (!year || !title || !description) {
            return NextResponse.json(
                { error: 'Year, title, and description are required' },
                { status: 400 }
            );
        }

        const id = uuidv4();

        interface MaxOrderResult {
            max_order: number | null;
        }

        const maxOrder = await query<MaxOrderResult[]>(
            `SELECT MAX(display_order) as max_order FROM journey_milestones`
        );
        const displayOrder = (maxOrder[0]?.max_order ?? -1) + 1;

        await query(
            `INSERT INTO journey_milestones (id, year, title, description, align, display_order) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, year, title, description, align, displayOrder]
        );

        await logActivity(request, admin.id.toString(), 'CREATE_JOURNEY_MILESTONE', { id, year, title });

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('Error creating journey milestone:', error);
        return NextResponse.json(
            { error: 'Failed to create journey milestone' },
            { status: 500 }
        );
    }
}
