import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const version = "1.0";
    return NextResponse.json({ version });
  } catch (error) {
    console.error('Error fetching version:', error);
    
    return NextResponse.json({ version: "1.0" }, { status: 200 });
  }
}