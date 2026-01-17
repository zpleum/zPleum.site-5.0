import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import fs from 'fs/promises';
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
        const filename = `${uuidv4()}${ext}`;
        const relativePath = `/projects/${filename}`;
        const absolutePath = path.join(process.cwd(), 'public', 'projects', filename);

        // Ensure directory exists
        await fs.mkdir(path.dirname(absolutePath), { recursive: true });

        await fs.writeFile(absolutePath, buffer);

        return NextResponse.json({
            success: true,
            url: relativePath
        });
    } catch (error: any) {
        console.error('Image upload error:', error);
        return NextResponse.json({
            error: 'Failed to upload image',
            message: error.message
        }, { status: 500 });
    }
}
