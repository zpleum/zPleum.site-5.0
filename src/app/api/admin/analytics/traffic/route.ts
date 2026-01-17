import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        // Daily views for the last 14 days
        const dailyTraffic = await query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as views,
                COUNT(DISTINCT ip_hash) as visitors
            FROM traffic_logs
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        return NextResponse.json({ dailyTraffic });
    } catch (error) {
        console.error('Fetch daily traffic error:', error);
        return NextResponse.json({ error: 'Failed to fetch traffic data' }, { status: 500 });
    }
}
