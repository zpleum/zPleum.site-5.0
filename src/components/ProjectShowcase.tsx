"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Project = {
  title: string;
  description: string;
  tags: string[];
  projectUrl: string;
  image: string;
};

const projects: Project[] = [
  {
    title: "Bonniecraft Minecraft Store",
    description: "A full-stack e-commerce platform tailored for Minecraft servers, delivering secure payments and automated item delivery.",
    tags: ["Next.js", "TypeScript", "Stripe", "MongoDB"],
    projectUrl: "https://bonniecraft.zpleum.site/",
    image: "/projects/bonniecraft.png",
  },
  {
    title: "zPleumVerify",
    description: "The Smart & Secure Minecraft Team Verification System with Discord API integration.",
    tags: ["React", "Discord API", "Node.js"],
    projectUrl: "https://zpleumverify.zpleum.site/",
    image: "/projects/zpleumverify.png",
  },
  {
    title: "zPleumCORE",
    description: "Advanced Security for Minecraft Servers. Real-time detection and blocking system.",
    tags: ["Java", "Minecraft API", "Redis"],
    projectUrl: "https://zpleumcore.zpleum.site/",
    image: "/projects/zpleumcore.png",
  },
];

export default function ProjectShowcase() {
  return (
    <section id="projects" className="py-24 bg-[var(--muted)]/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[var(--foreground)]">Featured Projects</h2>
          <p className="text-center text-[var(--foreground)]/60 mb-12 max-w-2xl mx-auto">
            Here are some of the projects I&apos;ve worked on. Each one was a unique challenge that helped me grow as a developer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-[var(--muted)]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-[var(--foreground)]/70 text-sm mb-6 flex-1 leading-relaxed">
                    {project.description}
                  </p>

                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors mt-auto"
                  >
                    View Project <ArrowUpRight size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}