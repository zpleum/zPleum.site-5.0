import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const settings = await query<any[]>(
            `SELECT * FROM profile_settings WHERE id = 1 LIMIT 1`
        );

        if (settings.length === 0) {
            return NextResponse.json({
                profile: {
                    full_name: 'Wiraphat Makwong',
                    profile_image_url: '/profile.png'
                }
            });
        }

        return NextResponse.json({ profile: settings[0] });
    } catch (error) {
        console.error('Error fetching profile settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile settings' },
            { status: 500 }
        );
    }
}
