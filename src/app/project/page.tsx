"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Github, FolderX, Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Carousel from "@/components/Carousel";

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

// Categories will be fetched from API

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(["All", ...(data.categories || [])]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Premium Background Architecture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="mb-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 px-6 py-3 bg-[var(--muted)]/20 hover:bg-blue-500/10 text-sm font-black uppercase tracking-widest rounded-xl border border-[var(--border)] transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Core Terminal
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
            <div>
              <div className="inline-flex items-center gap-3 px-6 py-2 mb-6 text-sm font-black uppercase tracking-[0.3em] bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Project Registry v4
              </div>
              <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] sm:leading-[0.8] uppercase mb-4">
                ALL <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  PROJECTS
                </span>
              </h1>
            </div>

            <p className="text-sm md:text-lg text-[var(--foreground-muted)] max-w-xl font-medium leading-relaxed lg:mb-4 border-l-2 border-blue-500/30 pl-5 sm:pl-6">
              An indexed registry of engineering protocols and digital architecture. Documenting the structural development and deployment of high-impact neural systems.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-[var(--card-bg)]/30 backdrop-blur-xl border border-[var(--border)] inline-flex transition-all">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-sm font-black uppercase tracking-widest transition-all duration-500 ${selectedCategory === category
                  ? "bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] scale-105"
                  : "text-[var(--foreground)]/40 hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects List */}
        <div className="flex flex-col gap-10 md:gap-12">
          {loading ? (
            <div className="flex flex-col gap-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[var(--card-bg)]/30 backdrop-blur-xl rounded-[2.5rem] h-[400px] animate-pulse border border-[var(--border)] shadow-2xl"></div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 mb-6 rounded-full bg-[var(--muted)]/10 border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] opacity-20">
                <FolderX size={36} strokeWidth={1} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.5em] mb-3 opacity-30">Registry Empty</h3>
              <p className="text-[var(--foreground-muted)] font-medium text-sm">No active records found for category: {selectedCategory}</p>
            </motion.div>
          ) : (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`group relative bg-[var(--card-bg)]/40 backdrop-blur-[40px] rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all duration-700 border border-[var(--border)] flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                {/* Visual Payload */}
                <div className="relative lg:w-[45%] h-[280px] lg:h-auto overflow-hidden">
                  <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[var(--background)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  {project.images && project.images.length > 0 ? (
                    <Carousel images={project.images} title={project.title} />
                  ) : project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out shadow-inner"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--muted)]/10 text-6xl opacity-20">
                      <FolderX size={60} strokeWidth={0.5} />
                    </div>
                  )}

                  <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
                    <div className="flex flex-col gap-2">
                      {project.category && (
                        <span className="px-4 sm:px-5 py-1 sm:py-1.5 bg-[var(--background)]/80 backdrop-blur-xl border border-[var(--border)] text-[var(--foreground)] text-[10px] sm:text-sm font-black rounded-full uppercase tracking-widest shadow-2xl">
                          {project.category}
                        </span>
                      )}
                    </div>
                    {!!project.featured && (
                      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-sm font-black shadow-[0_10px_25px_rgba(234,179,8,0.4)]">
                        CORE SYSTEM
                      </div>
                    )}
                  </div>
                </div>

                {/* Data Payload */}
                <div className="p-6 sm:p-10 lg:p-12 lg:w-[55%] flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none -rotate-12 translate-x-1/4 -translate-y-1/4">
                    <Rocket size={180} />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-5 opacity-40">
                      <div className="h-[1px] w-8 bg-blue-500"></div>
                      <span className="text-[11px] font-black uppercase tracking-[0.4em]">ID: {project.id.slice(0, 8)}</span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-black mb-4 sm:mb-5 group-hover:text-blue-500 transition-colors uppercase tracking-tighter leading-[0.9] sm:leading-none">
                      {project.title}
                    </h3>

                    <p className="text-base md:text-lg text-[var(--foreground-muted)] mb-8 font-medium leading-relaxed max-w-xl">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
                      {project.technologies.slice(0, 5).map((tag) => (
                        <span key={tag} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--muted)]/50 text-[10px] sm:text-sm font-black rounded-lg border border-[var(--border)] uppercase tracking-wider text-[var(--foreground)]/60">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          className="flex-1 py-4 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white text-center text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:scale-105 active:scale-95 transition-all outline-none"
                        >
                          Launch System
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          className="p-4 bg-[var(--muted)]/20 rounded-xl border border-[var(--border)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all hover:scale-105 active:scale-95 outline-none"
                        >
                          <Github size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
