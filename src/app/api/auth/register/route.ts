import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { hashPassword, validatePasswordStrength } from '@/lib/auth/password';
import { query } from '@/lib/db';
import { checkRateLimit, getClientIdentifier, RateLimits } from '@/lib/middleware/rate-limit';

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
    // Check if registration is enabled
    const registrationEnabled = process.env.ENABLE_ADMIN_REGISTRATION === 'true';

    if (!registrationEnabled) {
        return NextResponse.json(
            { error: 'Registration is currently disabled' },
            { status: 403 }
        );
    }

    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`register:${clientId}`, RateLimits.REGISTER);

    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: 'Too many registration attempts. Please try again later.' },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { error: 'Password does not meet requirements', details: passwordValidation.errors },
                { status: 400 }
            );
        }

        // Check if admin already exists
        const existingAdmin = await query(
            'SELECT id FROM admins WHERE email = ?',
            [email]
        );

        if (Array.isArray(existingAdmin) && existingAdmin.length > 0) {
            return NextResponse.json(
                { error: 'An admin with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create admin
        const adminId = uuidv4();
        await query(
            `INSERT INTO admins (id, email, password_hash, is_2fa_enabled)
       VALUES (?, ?, ?, ?)`,
            [adminId, email, passwordHash, false]
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Admin account created successfully',
                adminId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
