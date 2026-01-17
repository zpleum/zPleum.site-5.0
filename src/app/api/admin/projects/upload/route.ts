import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { uploadToR2 } from '@/lib/s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = path.extname(file.name) || '.png';
        const filename = `projects/${uuidv4()}${ext}`;

        // Upload to Cloudflare R2
        const r2Url = await uploadToR2(buffer, filename, file.type);

        return NextResponse.json({
            success: true,
            url: r2Url
        });
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Image upload error:', error);
        return NextResponse.json({
            error: 'Failed to upload image',
            message: err.message
        }, { status: 500 });
    }
}
