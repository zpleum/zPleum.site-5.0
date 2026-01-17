import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
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
