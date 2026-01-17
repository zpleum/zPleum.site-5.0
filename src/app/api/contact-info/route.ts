import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        interface ContactInfo {
            email: string;
            location: string;
            github_url: string;
            facebook_url: string;
            discord_url: string;
        }

        const contactInfo = await query<ContactInfo[]>(
            `SELECT * FROM contact_info WHERE id = 1 LIMIT 1`
        );

        if (contactInfo.length === 0) {
            return NextResponse.json({
                contactInfo: {
                    email: 'wiraphat.makwong@gmail.com',
                    location: 'Bangkok, Thailand',
                    github_url: 'https://github.com/zPleum',
                    facebook_url: 'https://www.facebook.com/wiraphat.makwong',
                    discord_url: 'https://discord.com/users/837918998242656267'
                }
            });
        }

        return NextResponse.json({ contactInfo: contactInfo[0] });
    } catch (error) {
        console.error('Error fetching contact info:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contact info' },
            { status: 500 }
        );
    }
}
