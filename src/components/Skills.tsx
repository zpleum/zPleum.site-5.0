"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Globe, Code, Database, Cloud } from "lucide-react";
import { useState, useEffect } from "react";

const iconMap: Record<string, any> = {
    Terminal,
    Cpu,
    Globe,
    Code,
    Database,
    Cloud
};

interface SkillCategory {
    title: string;
    icon: string;
    skills: string[];
    color: string;
}

export default function Skills() {
    const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await fetch('/api/skills');
            if (response.ok) {
                const data = await response.json();
                setSkillCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching skills:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col gap-4 mb-16">
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8]">
                        Stacks & <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Technologies</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-[var(--card-bg)]/30 backdrop-blur-3xl p-8 rounded-2xl border border-[var(--border)] h-64 animate-pulse" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 mb-16">
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8]">
                    Stacks & <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Technologies</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {skillCategories.map((cat, i) => {
                    const IconComponent = iconMap[cat.icon] || Terminal;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="bg-[var(--card-bg)]/30 backdrop-blur-3xl p-8 rounded-2xl border border-[var(--border)] hover:bg-[var(--card-bg)]/50 hover:border-blue-500/30 transition-all duration-700 group shadow-xl"
                        >
                            <div className={`p-3.5 rounded-xl bg-blue-500/10 text-blue-500 w-fit mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                <IconComponent size={28} />
                            </div>
                            <h3 className="text-xl font-black mb-8 tracking-tight uppercase">{cat.title}</h3>
                            <div className="flex flex-wrap gap-2.5">
                                {cat.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-4 py-2 bg-[var(--muted)]/30 rounded-lg text-sm font-black border border-[var(--border)] uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
