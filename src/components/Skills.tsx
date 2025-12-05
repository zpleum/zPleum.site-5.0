"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Database, Wrench, FileCode } from "lucide-react";

type Skill = {
  name: string;
  category: "Frontend" | "Backend" | "Tools" | "Languages";
  icon: "code" | "database" | "tools" | "file";
};

const skills: Skill[] = [
  { name: "React", category: "Frontend", icon: "code" },
  { name: "Next.js", category: "Frontend", icon: "code" },
  { name: "TypeScript", category: "Languages", icon: "file" },
  { name: "Tailwind CSS", category: "Frontend", icon: "code" },
  { name: "Node.js", category: "Backend", icon: "database" },
  { name: "MySQL", category: "Backend", icon: "database" },
  { name: "C++", category: "Backend", icon: "database" },
  { name: "GitHub", category: "Tools", icon: "tools" },
  { name: "JavaScript", category: "Languages", icon: "file" },
  { name: "Python", category: "Languages", icon: "file" },
];

const iconMap = {
  code: Code2,
  database: Database,
  tools: Wrench,
  file: FileCode,
};

const categoryColors = {
  Frontend: "from-blue-500 to-cyan-500",
  Backend: "from-purple-500 to-pink-500",
  Tools: "from-orange-500 to-red-500",
  Languages: "from-green-500 to-emerald-500",
};

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-[var(--background)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--accent-blue)]/30 rounded-full shadow-lg"
            >
              <Code2 size={16} className="text-[var(--accent-blue)]" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tech Stack
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[var(--foreground)]">
              Skills & Technologies
            </h2>
            <p className="text-center text-[var(--foreground)]/60 max-w-2xl mx-auto">
              My technical toolkit that I use to build scalable and efficient applications.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {skills.map((skill, index) => {
              const Icon = iconMap[skill.icon];
              const gradientColor = categoryColors[skill.category];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="group relative"
                >
                  {/* Gradient glow effect on hover */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradientColor} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300`}></div>

                  {/* Card */}
                  <div className="relative p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-transparent transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 h-full">
                    {/* Icon with gradient background */}
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColor} shadow-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>

                    {/* Skill name */}
                    <span className="font-semibold text-[var(--foreground)] group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {skill.name}
                    </span>

                    {/* Category badge */}
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--foreground)]/60">
                      {skill.category}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
