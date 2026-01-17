import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(_request: NextRequest) {
    const authResult = await requireAuth(_request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        interface Incident {
            id: string;
            title: string;
            description: string | null;
            severity: 'critical' | 'warning' | 'info';
            status: 'resolved' | 'investigating' | 'monitoring';
            started_at: Date | string;
            resolved_at: Date | string | null;
            created_at: Date | string;
        }

        // Fetch incidents from database
        const incidents = await query<Incident[]>(
            'SELECT * FROM incidents ORDER BY started_at DESC LIMIT 10'
        );

        // If no incidents, return some mock operational data for visualization
        if (incidents.length === 0) {
            return NextResponse.json({
                incidents: [
                    {
                        id: 'mock-1',
                        title: 'All Systems Operational',
                        description: 'No active incidents or service disruptions reported.',
                        severity: 'info',
                        status: 'resolved',
                        started_at: new Date(Date.now() - 3600000 * 24).toISOString(),
                        resolved_at: new Date(Date.now() - 3600000 * 23).toISOString(),
                        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
                    }
                ]
            });
        }

        return NextResponse.json({ incidents });
    } catch (error) {
        console.error('Fetch incidents error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch incidents' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const body = await request.json();
        const { title, description, severity, status } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const id = uuidv4();
        await query(
            'INSERT INTO incidents (id, title, description, severity, status) VALUES (?, ?, ?, ?, ?)',
            [id, title, description || null, severity || 'info', status || 'investigating']
        );

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('Log incident error:', error);
        return NextResponse.json(
            { error: 'Failed to log incident' },
            { status: 500 }
        );
    }
}
