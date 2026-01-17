import { NextRequest, NextResponse } from 'next/server';
import { logTraffic } from '@/lib/logger';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        await logTraffic(request, body.path);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
