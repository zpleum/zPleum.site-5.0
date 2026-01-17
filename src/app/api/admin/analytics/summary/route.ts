import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        // 1. Total Views & Unique Visitors (All time)
        const counts = await query(`
            SELECT 
                COUNT(*) as total_views,
                COUNT(DISTINCT ip_hash) as unique_visitors
            FROM traffic_logs
        `);

        // 2. Today's stats
        const todayStats = await query(`
            SELECT 
                COUNT(*) as total_views,
                COUNT(DISTINCT ip_hash) as unique_visitors
            FROM traffic_logs
            WHERE DATE(created_at) = CURDATE()
        `);

        // 3. Top Pages
        const topPages = await query(`
            SELECT path, COUNT(*) as views
            FROM traffic_logs
            GROUP BY path
            ORDER BY views DESC
            LIMIT 10
        `);

        // 4. Project distribution by category (for donut chart)
        const categoryDist = await query(`
            SELECT category, COUNT(*) as count
            FROM projects
            GROUP BY category
        `);

        return NextResponse.json({
            summary: {
                total: (counts as any)[0],
                today: (todayStats as any)[0],
            },
            topPages,
            categoryDist
        });
    } catch (error) {
        console.error('Fetch analytics summary error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
