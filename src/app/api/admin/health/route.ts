import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { testConnection } from '@/lib/db';
import os from 'os';

export async function GET(_request: NextRequest) {
    const authResult = await requireAuth(_request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        // Check database connection
        const dbStatus = await testConnection();

        // System information
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();

        // Environment configuration check
        const envConfig = {
            db: !!process.env.DB_HOST,
            resend: !!process.env.RESEND_API_KEY,
            totp: !!process.env.TOTP_ENCRYPTION_KEY,
            cloudflare: !!process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY,
            jwt: !!process.env.JWT_ACCESS_SECRET
        };

        const healthData = {
            status: dbStatus ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            services: {
                database: {
                    status: dbStatus ? 'online' : 'offline',
                    latency: 'normal' // Detailed latency check could be added if needed
                },
                backend: {
                    status: 'online',
                    version: process.version,
                    platform: process.platform,
                    uptime: Math.floor(uptime)
                }
            },
            system: {
                memory: {
                    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
                    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
                    rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
                    systemTotal: Math.round(totalMemory / 1024 / 1024 / 1024) + 'GB',
                    systemFree: Math.round(freeMemory / 1024 / 1024 / 1024) + 'GB'
                },
                cpuCount: os.cpus().length,
                loadAvg: os.loadavg()
            },
            config: envConfig
        };

        return NextResponse.json(healthData);
    } catch (error) {
        console.error('Health check error:', error);
        return NextResponse.json(
            { error: 'Failed to perform health check' },
            { status: 500 }
        );
    }
}
