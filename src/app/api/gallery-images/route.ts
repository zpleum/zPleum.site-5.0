import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const projectsDir = path.join(process.cwd(), 'public', 'projects');

        // Ensure directory exists
        try {
            await fs.access(projectsDir);
        } catch {
            return NextResponse.json({ images: [] });
        }

        const files = await fs.readdir(projectsDir);

        // Filter for image files only
        const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
        );

        return NextResponse.json({ images: imageFiles });
    } catch (error) {
        console.error('Error scanning projects directory:', error);
        return NextResponse.json({ error: 'Failed to scan images' }, { status: 500 });
    }
}
