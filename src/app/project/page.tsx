"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Github, ExternalLink, Sparkles } from "lucide-react";
import { useState } from "react";

type Project = {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: string;
  projectUrl: string;
  githubUrl?: string;
  image: string;
  featured: boolean;
};

const projects: Project[] = [
  {
    title: "Bonniecraft Minecraft Store",
    description: "A full-stack e-commerce platform tailored for Minecraft servers",
    longDescription: "A comprehensive e-commerce solution built specifically for Minecraft servers, featuring secure payment processing through Stripe, automated item delivery, real-time inventory management, and a beautiful user interface. The platform handles thousands of transactions monthly and integrates seamlessly with Minecraft server plugins.",
    tags: ["Next.js", "TypeScript", "Stripe", "MongoDB", "Redis"],
    category: "E-Commerce",
    projectUrl: "https://bonniecraft.zpleum.site/",
    image: "/projects/bonniecraft.png",
    featured: true,
  },
  {
    title: "zPleumVerify",
    description: "Smart & Secure Minecraft Team Verification System",
    longDescription: "An advanced verification system that integrates with Discord API to provide secure team member authentication for Minecraft servers. Features include role-based access control, automated verification workflows, and comprehensive audit logging.",
    tags: ["React", "Discord API", "Node.js", "PostgreSQL"],
    category: "Security",
    projectUrl: "https://zpleumverify.zpleum.site/",
    image: "/projects/zpleumverify.png",
    featured: true,
  },
  {
    title: "zPleumCORE",
    description: "Advanced Security for Minecraft Servers",
    longDescription: "A real-time detection and blocking system designed to protect Minecraft servers from various threats. Implements machine learning algorithms for pattern recognition, automated threat response, and detailed analytics dashboard.",
    tags: ["Java", "Minecraft API", "Redis", "Machine Learning"],
    category: "Security",
    projectUrl: "https://zpleumcore.zpleum.site/",
    image: "/projects/zpleumcore.png",
    featured: false,
  },
];

const categories = ["All", "E-Commerce", "Security", "Web App"];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-24 py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--accent-blue)]/30 rounded-full shadow-lg">
            <Sparkles size={16} className="text-[var(--accent-blue)]" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Work
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed">
            A collection of my recent work, showcasing expertise in full-stack development,
            security systems, and modern web technologies.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${selectedCategory === category
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                : "bg-[var(--card-bg)]/80 backdrop-blur-sm text-[var(--foreground)] hover:bg-[var(--card-bg)] hover:shadow-md border border-[var(--border)]"
                }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="group relative bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--border)]"
            >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Featured
                </div>
              )}

              {/* Project Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>

                <p className="text-[var(--foreground-muted)] mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[var(--muted)] text-[var(--foreground)] text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 bg-[var(--muted)] text-[var(--foreground)] text-xs rounded-md">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                  >
                    <span>View Project</span>
                    <ExternalLink size={16} />
                  </a>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-[var(--muted)] text-[var(--foreground)] rounded-lg hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300"
                    >
                      <Github size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-[var(--foreground-muted)]">No projects found in this category.</p>
          </motion.div>
        )}
      </main>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-20 text-center w-full"
      >

        <section id="contact" className="relative py-32 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white">
                <span>💼</span>
                <span>Available for Work</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Let&apos;s Work Together
              </h2>

              <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
                I&apos;m currently available for freelance work and full-time opportunities.
                If you have a project that needs some creative touch, I&apos;d love to hear about it.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/contact"
                  className="group px-10 py-4 bg-white text-purple-600 font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Get In Touch
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="mailto:wiraphat.makwong@gmail.com"
                  className="px-10 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-bold rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}