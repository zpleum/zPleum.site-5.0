"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Github, ExternalLink, X } from "lucide-react";
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
  const [lightboxState, setLightboxState] = useState<{
    images: string[];
    currentIndex: number;
    title: string;
    category?: string;
    projectId: string;
  } | null>(null);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxState) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setLightboxState(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxState]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightboxState) return;
    setLightboxState(prev => prev ? ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }) : null);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightboxState) return;
    setLightboxState(prev => prev ? ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }) : null);
  };

  const fetchFeaturedProjects = async () => {
    try {
      // Fetch only featured projects for the showcase
      const response = await fetch('/api/projects?featured=true');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch {
      console.error('Error fetching featured projects');
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
                <Carousel
                  images={project.images}
                  title={project.title}
                  onImageClick={(src, alt, idx) => setLightboxState({
                    images: project.images!,
                    currentIndex: idx,
                    title: project.title,
                    category: project.category,
                    projectId: project.id
                  })}
                />
              ) : project.image_url ? (
                <div
                  className="relative w-full h-full cursor-zoom-in"
                  onClick={() => setLightboxState({
                    images: [project.image_url],
                    currentIndex: 0,
                    title: project.title,
                    category: project.category,
                    projectId: project.id
                  })}
                >
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)]/80 via-transparent to-transparent opacity-40 group-hover:opacity-0 transition-opacity duration-500"></div>
                </div>
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

      {/* Cinema-Grade Lightbox */}
      <AnimatePresence>
        {lightboxState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
          >
            <div
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
              onClick={() => setLightboxState(null)}
            />

            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-6 sm:top-10 right-6 sm:right-10 p-4 sm:p-6 bg-white/5 rounded-full text-white hover:bg-white/10 transition-all border border-white/10 z-[110] shadow-2xl backdrop-blur-xl"
              onClick={() => setLightboxState(null)}
            >
              <X size={24} className="sm:w-[32px] sm:h-[32px]" strokeWidth={3} />
            </motion.button>

            {/* Navigation Buttons */}
            {lightboxState.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 p-4 sm:p-6 bg-white/5 rounded-full text-white hover:bg-white/10 transition-all border border-white/10 z-[110] shadow-2xl backdrop-blur-xl group"
                >
                  <ArrowLeft className="sm:w-[32px] sm:h-[32px]" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 p-4 sm:p-6 bg-white/5 rounded-full text-white hover:bg-white/10 transition-all border border-white/10 z-[110] shadow-2xl backdrop-blur-xl group"
                >
                  <ArrowRight className="sm:w-[32px] sm:h-[32px]" />
                </button>
              </>
            )}

            <motion.div
              key={lightboxState.currentIndex}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-6xl aspect-[4/3] md:aspect-video rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5"
            >
              <Image
                src={lightboxState.images[lightboxState.currentIndex]}
                alt={`${lightboxState.title} - View ${lightboxState.currentIndex + 1}`}
                fill
                className="object-contain"
                priority
              />

              {/* Lightbox Info Bar */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-12 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pointer-events-none">
                <div>
                  <span className="text-[10px] sm:text-sm font-black text-blue-400 uppercase tracking-[0.4em] mb-2 sm:mb-4 block">
                    Project ID: {lightboxState.projectId.slice(0, 8)}-{lightboxState.currentIndex === 0 ? 'MAIN' : `VIEW-0${lightboxState.currentIndex + 1}`}
                  </span>
                  <h3 className="text-xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] sm:leading-none">
                    {lightboxState.title} <span className="text-white/30 text-lg sm:text-2xl ml-2">[{lightboxState.currentIndex + 1}/{lightboxState.images.length}]</span>
                  </h3>
                </div>
                {lightboxState.category && (
                  <div className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white font-black uppercase tracking-[0.2em] text-[10px] sm:text-sm w-fit">
                    {lightboxState.category}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
