import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        // Fetch all logs
        const activityLogs = await query('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 5000');
        const trafficLogs = await query('SELECT * FROM traffic_logs ORDER BY created_at DESC LIMIT 5000');

        const exportData = {
            exportDate: new Date().toISOString(),
            generatedBy: authResult.admin.email,
            activity: activityLogs,
            traffic: trafficLogs
        };

        // Log this action
        await logActivity(request, authResult.admin.id, 'UPDATE_ADMIN', { action: 'EXPORT_LOGS' });

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="zpleum-registry-${new Date().toISOString().split('T')[0]}.json"`
            }
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Failed to export registry' }, { status: 500 });
    }
}
