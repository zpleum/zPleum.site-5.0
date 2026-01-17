import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const settings = await query<any[]>(
            `SELECT * FROM profile_settings WHERE id = 1 LIMIT 1`
        );

        if (settings.length === 0) {
            return NextResponse.json({
                profile: {
                    full_name: 'Wiraphat Makwong',
                    profile_image_url: '/profile.png',
                    email: 'wiraphat.makwong@gmail.com',
                    github_url: 'https://github.com/zPleum',
                    linkedin_url: 'https://linkedin.com/in/wiraphat-makwong',
                    facebook_url: 'https://www.facebook.com/wiraphat.makwong',
                    instagram_url: 'https://www.instagram.com/zpleum.tsx',
                    discord_url: 'https://discord.com/users/837918998242656267'
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

export async function PATCH(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;

    try {
        const body = await request.json();
        const { full_name, profile_image_url, email, github_url, linkedin_url, facebook_url, instagram_url, discord_url } = body;

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (full_name !== undefined) {
            updateFields.push('full_name = ?');
            updateValues.push(full_name);
        }

        // If updating profile image, delete old file first
        if (profile_image_url !== undefined) {
            // Get current profile image URL
            const currentProfile = await query<any[]>(
                `SELECT profile_image_url FROM profile_settings WHERE id = 1 LIMIT 1`
            );

            if (currentProfile.length > 0) {
                const oldImageUrl = currentProfile[0].profile_image_url;

                // Only delete if it's an uploaded file (starts with /uploads/ or /profile/)
                if (oldImageUrl && (oldImageUrl.startsWith('/uploads/') || oldImageUrl.startsWith('/profile/'))) {
                    try {
                        const fs = require('fs').promises;
                        const path = require('path');
                        const filePath = path.join(process.cwd(), 'public', oldImageUrl);

                        // Check if file exists before deleting
                        await fs.access(filePath);
                        await fs.unlink(filePath);
                        console.log(`Deleted old profile image: ${filePath}`);
                    } catch (err) {
                        // File doesn't exist or couldn't be deleted, continue anyway
                        console.log(`Could not delete old profile image: ${err}`);
                    }
                }
            }

            updateFields.push('profile_image_url = ?');
            updateValues.push(profile_image_url);
        }

        if (github_url !== undefined) {
            updateFields.push('github_url = ?');
            updateValues.push(github_url);
        }
        if (linkedin_url !== undefined) {
            updateFields.push('linkedin_url = ?');
            updateValues.push(linkedin_url);
        }
        if (facebook_url !== undefined) {
            updateFields.push('facebook_url = ?');
            updateValues.push(facebook_url);
        }
        if (instagram_url !== undefined) {
            updateFields.push('instagram_url = ?');
            updateValues.push(instagram_url);
        }
        if (discord_url !== undefined) {
            updateFields.push('discord_url = ?');
            updateValues.push(discord_url);
        }
        if (email !== undefined) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }

        if (updateFields.length === 0) {
            return NextResponse.json(
                { error: 'No updates provided' },
                { status: 400 }
            );
        }

        updateValues.push(1);

        await query(
            `UPDATE profile_settings SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        await logActivity(request, admin.id, 'UPDATE_PROFILE', { full_name });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating profile settings:', error);
        return NextResponse.json(
            { error: 'Failed to update profile settings' },
            { status: 500 }
        );
    }
}
