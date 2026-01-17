"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    FolderGit2,
    ExternalLink,
    Github,
    Edit3,
    Trash2,
    Star,
    AlertTriangle,
    ShieldAlert
} from 'lucide-react';

interface Project {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    project_url: string | null;
    github_url: string | null;
    technologies: string[];
    featured: boolean;
    images: string[] | string | null;  // Added for gallery count
    created_by_email: string;
    updated_by_email: string;
    created_at: string;
    updated_at: string;
    category?: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/admin/projects');
            if (response.ok) {
                const data = await response.json();
                setProjects(data.projects || []);
            }
        } catch {
            console.error('Error fetching projects');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/projects/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setProjects(projects.filter(p => p.id !== deleteId));
                setDeleteId(null);
            } else {
                alert('Failed to delete project');
            }
        } catch {
            console.error('Error deleting project');
            alert('Error deleting project');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[var(--background)] overflow-x-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex justify-between items-center text-center md:text-left flex-col md:flex-row gap-6 md:gap-0">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/admin/dashboard"
                                className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)] hover:text-blue-500 rounded-2xl transition-all border border-[var(--border)]"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-black tracking-tighter uppercase">Project Architecture</h1>
                                <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">Foundry Interface</p>
                            </div>
                        </div>

                        <Link
                            href="/admin/dashboard/projects/new"
                            className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95"
                        >
                            <Plus size={20} />
                            <span>New Project</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Synchronizing Projects</h3>
                        <p className="text-[var(--foreground-muted)] font-medium">Fetching entities from the database...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-[var(--card-bg)]/30 backdrop-blur-xl rounded-[3rem] border border-[var(--border)] border-dashed">
                        <div className="p-8 bg-blue-500/10 text-blue-500 rounded-full mb-8">
                            <FolderGit2 size={64} />
                        </div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">The Gallery is Empty</h3>
                        <p className="text-xl text-[var(--foreground-muted)] font-medium mb-10 max-w-md">No projects have been architected yet. Start building your portfolio today.</p>
                        <Link
                            href="/admin/dashboard/projects/new"
                            className="px-10 py-5 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 transition-transform"
                        >
                            Initialize First Project
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {projects.map((project, i) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] hover:border-blue-500/30 transition-all duration-500 shadow-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                    <FolderGit2 size={160} />
                                </div>

                                <div className="flex flex-col lg:flex-row gap-10">
                                    {/* Image Preview Container */}
                                    <div className="relative w-full lg:w-72 h-48 rounded-[1.5rem] overflow-hidden border border-[var(--border)] bg-[var(--background)]/50 shrink-0 group/img">
                                        {project.image_url ? (
                                            <>
                                                <Image
                                                    src={project.image_url}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"></div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-20">
                                                <FolderGit2 size={40} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">No Visual Matrix</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[1.5rem]"></div>

                                        {/* Gallery Count Indicator */}
                                        {(() => {
                                            let count = 0;
                                            try {
                                                if (Array.isArray(project.images)) count = project.images.length;
                                                else if (typeof project.images === 'string') count = JSON.parse(project.images).length;
                                            } catch { }

                                            if (count > 1) {
                                                return (
                                                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10 flex items-center gap-1.5 z-10">
                                                        <FolderGit2 size={10} />
                                                        <span>+{count - 1}</span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>

                                    <div className="flex-1 flex flex-col lg:flex-row justify-between items-start gap-10">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">{project.title}</h3>
                                                {project.featured && (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        <Star size={12} fill="currentColor" />
                                                        <span>Featured</span>
                                                    </div>
                                                )}
                                                {project.category && (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        <span>{project.category}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-xl text-[var(--foreground-muted)] font-medium line-clamp-2 max-w-3xl leading-relaxed">
                                                {project.description}
                                            </p>

                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-3">
                                                    {project.technologies.map((tech, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-4 py-2 bg-[var(--muted)]/50 text-[var(--foreground)]/70 border border-[var(--border)] rounded-xl text-xs font-black uppercase tracking-widest"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-8 pt-4">
                                                {project.project_url && (
                                                    <a
                                                        href={project.project_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[var(--foreground)]/50 hover:text-blue-500 transition-colors"
                                                    >
                                                        <ExternalLink size={16} /> Interface
                                                    </a>
                                                )}
                                                {project.github_url && (
                                                    <a
                                                        href={project.github_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[var(--foreground)]/50 hover:text-blue-500 transition-colors"
                                                    >
                                                        <Github size={16} /> Repository
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex lg:flex-col gap-4 w-full lg:w-auto">
                                            <Link
                                                href={`/admin/dashboard/projects/${project.id}/edit`}
                                                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500/20 rounded-2xl font-black uppercase tracking-widest transition-all"
                                            >
                                                <Edit3 size={20} />
                                                <span>Edit</span>
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(project.id)}
                                                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black uppercase tracking-widest transition-all"
                                            >
                                                <Trash2 size={20} />
                                                <span>Erase</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Deletion Modal */}
            <AnimatePresence>
                {deleteId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setDeleteId(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[var(--card-bg)] border border-red-500/20 rounded-[3rem] p-10 md:p-14 shadow-[0_0_50px_rgba(239,68,68,0.1)] overflow-hidden"
                        >
                            {/* Decorative background intensity */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>

                            <div className="relative z-10 text-center">
                                <div className="w-24 h-24 mx-auto mb-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                    <ShieldAlert size={48} />
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-6">
                                    ERASE PROTOCOL
                                </h2>

                                <p className="text-[var(--foreground-muted)] text-lg font-medium mb-12 leading-relaxed">
                                    Are you certain you wish to permanently terminate this project matrix? This action is <span className="text-red-500 font-bold uppercase tracking-wider">irreversible</span>.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-5">
                                    <button
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        className="flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-6 rounded-2xl transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {isDeleting ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Trash2 size={24} />
                                                <span>Confirm Erase</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(null)}
                                        disabled={isDeleting}
                                        className="flex-1 bg-[var(--muted)]/20 hover:bg-[var(--muted)]/40 text-[var(--foreground)] font-black uppercase tracking-widest py-6 rounded-2xl transition-all border border-[var(--border)]"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </div>

                            {/* Corner identification */}
                            <div className="absolute bottom-6 right-8 opacity-10 flex items-center gap-2">
                                <AlertTriangle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Critical Access</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
