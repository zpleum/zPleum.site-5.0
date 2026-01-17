import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface Stat {
    id: string;
    label: string;
    value: string;
    icon: string;
    color: string;
    display_order: number;
}

export async function GET() {
    try {
        const stats = await query<Stat[]>(
            `SELECT * FROM stats ORDER BY display_order ASC`
        );

        return NextResponse.json({ stats });
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
