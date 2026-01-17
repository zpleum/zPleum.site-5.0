"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Github, ExternalLink, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category?: string;
  project_url: string;
  github_url?: string;
  image_url: string;
  images?: string[];
  featured: boolean;
};

import Carousel from "./Carousel";
import Link from "next/link";

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      // Fetch only featured projects for the showcase
      const response = await fetch('/api/projects?featured=true');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-10">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[var(--card-bg)]/30 backdrop-blur-3xl rounded-2xl overflow-hidden border border-[var(--border)] h-[400px] animate-pulse flex flex-col md:flex-row">
              <div className="md:w-[45%] h-64 md:h-full bg-[var(--muted)]/50"></div>
              <div className="md:w-[55%] p-10 flex flex-col justify-center">
                <div className="h-8 bg-[var(--muted)]/50 rounded-xl mb-6 w-3/4"></div>
                <div className="h-4 bg-[var(--muted)]/50 rounded-lg mb-3"></div>
                <div className="h-4 bg-[var(--muted)]/50 rounded-lg w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 mb-10 sm:mb-16">
        <h2 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase leading-[0.9] sm:leading-[0.8]">
          Selected <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Works</span>
        </h2>
      </div>

      <div className="flex flex-col gap-10">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`group relative bg-[var(--card-bg)]/30 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all duration-700 border border-[var(--border)] flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
          >
            {/* Project Image Container */}
            <div className="relative lg:w-[45%] h-[280px] lg:h-auto overflow-hidden">
              {project.images && project.images.length > 0 ? (
                <Carousel images={project.images} title={project.title} />
              ) : project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500/5">
                  <span className="text-6xl opacity-20">📁</span>
                </div>
              )}

              {project.category && (
                <div className="absolute top-6 left-6 z-10">
                  <span className="px-6 py-2 bg-[var(--card-bg)]/80 backdrop-blur-md border border-[var(--border)] text-[var(--foreground)] text-sm font-black rounded-full uppercase tracking-wider shadow-xl origin-left">
                    # {project.category}
                  </span>
                </div>
              )}
            </div>

            {/* Project Content Container */}
            <div className="p-6 sm:p-8 md:p-12 lg:w-[55%] flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-5 opacity-40">
                <div className="h-[1px] w-8 bg-blue-500"></div>
                <span className="text-sm font-black uppercase tracking-[0.4em]">ID: {project.id.slice(0, 8)}</span>
              </div>

              <h3 className="text-3xl font-black text-[var(--foreground)] mb-6 tracking-tighter group-hover:text-blue-500 transition-colors uppercase leading-none">
                {project.title}
              </h3>

              <p className="text-base md:text-lg text-[var(--foreground-muted)] mb-10 leading-relaxed font-medium max-w-xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
                {project.technologies.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[var(--muted)]/30 text-[var(--foreground)] text-[10px] sm:text-sm font-black rounded-xl border border-[var(--border)] uppercase tracking-wider opacity-60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 px-6 sm:px-10 py-5 sm:py-6 bg-blue-600 hover:bg-blue-500 text-white text-[10px] sm:text-sm font-black uppercase tracking-widest rounded-xl shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
                  >
                    <span>Deploy View</span>
                    <ExternalLink size={14} className="sm:w-[16px] sm:h-[16px]" />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 bg-[var(--muted)]/50 text-[var(--foreground)] rounded-xl hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:-translate-y-1 active:scale-95 transition-all border border-[var(--border)]"
                  >
                    <Github size={20} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/project"
          className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--card-bg)]/30 text-[var(--foreground)] text-sm font-black uppercase tracking-widest rounded-xl border border-[var(--border)] hover:bg-blue-500/10 hover:border-blue-500/30 transition-all active:scale-95 group"
        >
          Access Full Registry
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
