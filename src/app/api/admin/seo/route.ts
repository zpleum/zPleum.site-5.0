import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const seoSettings = await query<any[]>(
            'SELECT site_title, site_description, keywords, og_image FROM seo_settings WHERE id = 1'
        );

        if (seoSettings.length === 0) {
            // Return defaults if not found in DB
            return NextResponse.json({
                seo: {
                    site_title: 'zPleum - Full Stack Developer',
                    site_description: 'Portfolio of Wiraphat Makwong, aka Pleum, Full Stack Developer',
                    keywords: 'developer, portfolio, nextjs, typescript, engineering',
                    og_image: '/og-image.jpg'
                }
            });
        }

        return NextResponse.json({ seo: seoSettings[0] });
    } catch (error) {
        console.error('Fetch SEO error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch SEO settings' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const body = await request.json();
        const { site_title, site_description, keywords, og_image } = body;

        // Upsert logic
        await query(
            `INSERT INTO seo_settings (id, site_title, site_description, keywords, og_image) 
             VALUES (1, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             site_title = VALUES(site_title), 
             site_description = VALUES(site_description), 
             keywords = VALUES(keywords), 
             og_image = VALUES(og_image)`,
            [site_title, site_description || null, keywords || null, og_image || null]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update SEO error:', error);
        return NextResponse.json(
            { error: 'Failed to update SEO configuration' },
            { status: 500 }
        );
    }
}
