import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Auto-migration check (lightweight) - ensure table exists
        try {
            await query('SELECT 1 FROM certificate_categories LIMIT 1');
        } catch {
            // If table doesn't exist, return empty list (or could create it, but admin route handles creation)
            return NextResponse.json({ categories: [] });
        }

        interface CategoryRow {
            name: string;
        }

        const categories = await query<CategoryRow[]>('SELECT * FROM certificate_categories ORDER BY sort_order ASC, name ASC');

        // Return as simple array of strings for easier consumption by frontend
        const categoryNames = categories.map((c) => c.name);

        return NextResponse.json({ categories: categoryNames });
    } catch (error) {
        console.error('Get certificate categories error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
