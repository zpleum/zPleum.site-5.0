import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        interface CategoryRow {
            name: string;
        }
        const categories = await query<CategoryRow[]>('SELECT * FROM categories ORDER BY sort_order ASC, name ASC');
        // Return as simple array of strings for easier consumption
        const categoryNames = categories.map((c) => c.name);
        return NextResponse.json({ categories: categoryNames });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
