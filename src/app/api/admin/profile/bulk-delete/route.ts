import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { deleteFromR2 } from '@/lib/s3';

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const body = await request.json();
        const { urls } = body as { urls: string[] };

        if (!urls || !Array.isArray(urls)) {
            return NextResponse.json(
                { error: 'URLs array is required' },
                { status: 400 }
            );
        }

        // Delete all images
        const results = await Promise.allSettled(
            urls.map(url => deleteFromR2(url))
        );

        const failed = results.filter(r => r.status === 'rejected').length;
        const succeeded = results.filter(r => r.status === 'fulfilled').length;

        return NextResponse.json({
            success: true,
            deleted: succeeded,
            failed,
        });
    } catch (error) {
        console.error('Bulk delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete images' },
            { status: 500 }
        );
    }
}
