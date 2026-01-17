import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';

interface ContactInfo {
    id: number;
    email: string;
    location: string;
    github_url: string;
    facebook_url: string;
    discord_url: string;
}

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
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
    } catch {
        console.error('Error fetching contact info');
        return NextResponse.json(
            { error: 'Failed to fetch contact info' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;

    try {
        const body = await request.json();
        const { email, location, github_url, facebook_url, discord_url } = body;

        const updateFields: string[] = [];
        const updateValues: unknown[] = [];

        if (email !== undefined) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (location !== undefined) {
            updateFields.push('location = ?');
            updateValues.push(location);
        }
        if (github_url !== undefined) {
            updateFields.push('github_url = ?');
            updateValues.push(github_url);
        }
        if (facebook_url !== undefined) {
            updateFields.push('facebook_url = ?');
            updateValues.push(facebook_url);
        }
        if (discord_url !== undefined) {
            updateFields.push('discord_url = ?');
            updateValues.push(discord_url);
        }

        if (updateFields.length === 0) {
            return NextResponse.json(
                { error: 'No updates provided' },
                { status: 400 }
            );
        }

        updateValues.push(1);

        await query(
            `UPDATE contact_info SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        await logActivity(request, String(admin.id), 'UPDATE_CONTACT_INFO', { email, location });

        return NextResponse.json({ success: true });
    } catch {
        console.error('Error updating contact info');
        return NextResponse.json(
            { error: 'Failed to update contact info' },
            { status: 500 }
        );
    }
}
