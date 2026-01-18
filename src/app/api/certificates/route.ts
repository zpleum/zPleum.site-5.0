import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const certificates = await query(
            `SELECT * FROM certificates 
             ORDER BY featured DESC, created_at DESC`
        );

        return NextResponse.json({ certificates });
    } catch (error) {
        console.error('Fetch certificates error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch certificates' },
            { status: 500 }
        );
    }
}
