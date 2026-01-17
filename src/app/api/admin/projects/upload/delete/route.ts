import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { deleteFromR2 } from '@/lib/s3';

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
        }

        // Only delete if it's an R2 URL
        if (url.startsWith('http')) {
            await deleteFromR2(url);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    } catch (error) {
        console.error('Delete image error:', error);
        return NextResponse.json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    }
}
