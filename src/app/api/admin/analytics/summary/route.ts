import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        interface AnalyticsCount {
            total_views: number;
            unique_visitors: number;
        }

        // 1. Total Views & Unique Visitors (All time)
        const counts = await query<AnalyticsCount[]>(`
            SELECT 
                COUNT(*) as total_views,
                COUNT(DISTINCT ip_hash) as unique_visitors
            FROM traffic_logs
        `);

        // 2. Today's stats
        const todayStats = await query<AnalyticsCount[]>(`
            SELECT 
                COUNT(*) as total_views,
                COUNT(DISTINCT ip_hash) as unique_visitors
            FROM traffic_logs
            WHERE DATE(created_at) = CURDATE()
        `);

        // 3. Top Pages
        interface TopPageRow {
            path: string;
            views: number;
        }

        const topPages = await query<TopPageRow[]>(`
            SELECT path, COUNT(*) as views
            FROM traffic_logs
            GROUP BY path
            ORDER BY views DESC
            LIMIT 10
        `);

        // 4. Project distribution by category (for donut chart)
        interface CategoryDistRow {
            category: string;
            count: number;
        }

        const categoryDist = await query<CategoryDistRow[]>(`
            SELECT category, COUNT(*) as count
            FROM projects
            GROUP BY category
        `);

        return NextResponse.json({
            summary: {
                total: counts[0],
                today: todayStats[0],
            },
            topPages,
            categoryDist
        });
    } catch (error) {
        console.error('Fetch analytics summary error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
