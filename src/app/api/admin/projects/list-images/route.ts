import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { listFromR2 } from '@/lib/s3';

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        // List all project images from R2
        const images = await listFromR2('projects/');

        return NextResponse.json({ images });
    } catch (error) {
        console.error('List project images error:', error);
        return NextResponse.json(
            { error: 'Failed to list project images' },
            { status: 500 }
        );
    }
}
