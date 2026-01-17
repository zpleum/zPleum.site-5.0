import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        interface Milestone {
            id: string | number;
            title: string;
            description: string;
            date: string;
            icon: string;
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
