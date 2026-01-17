import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface SkillCategory {
    id: string;
    title: string;
    icon: string;
    color: string;
    display_order: number;
}

interface Skill {
    id: string;
    name: string;
    category_id: string;
    display_order: number;
}

export async function GET() {
    try {
        // Fetch all categories with their skills
        const categories = await query<SkillCategory[]>(
            `SELECT * FROM skill_categories ORDER BY display_order ASC`
        );

        const categoriesWithSkills = await Promise.all(
            categories.map(async (category) => {
                const skills = await query<Skill[]>(
                    `SELECT * FROM skills WHERE category_id = ? ORDER BY display_order ASC`,
                    [category.id]
                );

                return {
                    title: category.title,
                    icon: category.icon,
                    color: category.color,
                    skills: skills.map(s => s.name)
                };
            })
        );

        return NextResponse.json({ categories: categoriesWithSkills });
    } catch (error) {
        console.error('Error fetching skills:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skills' },
            { status: 500 }
        );
    }
}
