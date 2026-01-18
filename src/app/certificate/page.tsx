"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Award, Calendar, BadgeCheck, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

import Carousel from "@/components/Carousel";

type Certificate = {
    id: string;
    title: string;
    issuer: string;
    date: string;
    credential_url?: string;
    image_url: string;
    images?: string[];
    skills: string[];
    featured: boolean;
    category?: string;
};

export default function Certificates() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(["All"]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // State for Lightbox
    const [lightboxState, setLightboxState] = useState<{
        images: string[];
        currentIndex: number;
        title: string;
        category?: string;
        certId: string;
    } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catResponse = await fetch('/api/certificate-categories');
                if (catResponse.ok) {
                    const catData = await catResponse.json();
                    setCategories(["All", ...(catData.categories || [])]);
                }

                // Fetch certificates
                const certResponse = await fetch('/api/certificates');
                if (certResponse.ok) {
                    const data = await certResponse.json();
                    // Parse skills if they are strings
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const parsedCertificates = data.certificates.map((cert: any) => ({
                        ...cert,
                        skills: typeof cert.skills === 'string' ? JSON.parse(cert.skills) : cert.skills || [],
                        images: typeof cert.images === 'string' ? JSON.parse(cert.images) : cert.images || []
                    }));
                    setCertificates(parsedCertificates);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

    const filteredCertificates = selectedCategory === "All"
        ? certificates
        : certificates.filter(c => c.category === selectedCategory);

    return (
        <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
            {/* Premium Background Architecture - Matching Project Page */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2"></div>
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
                                Certificate Registry v1
                            </div>
                            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] sm:leading-[0.8] uppercase mb-4">
                                MY <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                    LICENSE
                                </span>
                            </h1>
                        </div>

                        <p className="text-sm md:text-lg text-[var(--foreground-muted)] max-w-xl font-medium leading-relaxed lg:mb-4 border-l-2 border-blue-500/30 pl-5 sm:pl-6">
                            Official validation of technical competencies and authorized skill protocols. Verified credentials for deployed neural systems.
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

                {/* Certificates Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <h3 className="text-xl font-black uppercase tracking-widest animate-pulse opacity-60">Retrieving Credentials</h3>
                    </div>
                ) : filteredCertificates.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-24 h-24 mb-6 rounded-full bg-[var(--muted)]/10 border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] opacity-20">
                            <Award size={36} strokeWidth={1} />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.5em] mb-3 opacity-30">Registry Empty</h3>
                        <p className="text-[var(--foreground-muted)] font-medium text-sm">No valid credentials found for category: {selectedCategory}</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                        {filteredCertificates.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group relative bg-[var(--card-bg)]/40 backdrop-blur-[40px] rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 border border-[var(--border)] flex flex-col h-full"
                            >
                                {/* Image Cover or Abstract Background */}
                                <div className="relative h-56 w-full overflow-hidden border-b border-[var(--border)] group-hover:h-64 transition-all duration-500">
                                    {/* Category Pill Over Image */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                            {cert.category || 'Certification'}
                                        </div>
                                    </div>

                                    {cert.images && cert.images.length > 0 ? (
                                        <Carousel
                                            images={cert.images}
                                            title={cert.title}
                                            onImageClick={(src, alt, idx) => setLightboxState({
                                                images: cert.images!,
                                                currentIndex: idx,
                                                title: cert.title,
                                                category: cert.category,
                                                certId: cert.id
                                            })}
                                        />
                                    ) : cert.image_url ? (
                                        <div
                                            className="relative w-full h-full cursor-zoom-in group/img"
                                            onClick={() => setLightboxState({
                                                images: [cert.image_url],
                                                currentIndex: 0,
                                                title: cert.title,
                                                category: cert.category,
                                                certId: cert.id
                                            })}
                                        >
                                            <Image
                                                src={cert.image_url}
                                                alt={cert.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent opacity-80"></div>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-colors duration-500">
                                            {/* Decorative Elements for No Image */}
                                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px]"></div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                                                <Award size={64} className="text-[var(--foreground)]" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Data Payload */}
                                <div className="p-8 sm:p-10 flex flex-col flex-1 relative z-10">

                                    {/* Header: Date & Issuer */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] opacity-60">Issued By</span>
                                            <div className="flex items-center gap-2 text-blue-500 font-bold text-sm uppercase tracking-wide">
                                                <BadgeCheck size={16} />
                                                {cert.issuer}
                                            </div>
                                        </div>
                                        <div className="px-4 py-1.5 bg-[var(--background)]/50 border border-[var(--border)] rounded-full text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] flex items-center gap-2">
                                            <Calendar size={12} />
                                            {cert.date}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl sm:text-3xl font-black mb-4 group-hover:text-blue-500 transition-colors uppercase tracking-tight leading-[0.95]">
                                        {cert.title}
                                    </h3>

                                    {/* Skills/Tags */}
                                    <div className="flex flex-wrap gap-2 mb-8 mt-auto pt-6">
                                        {cert.skills.map((tag) => (
                                            <span key={tag} className="px-3 py-1 bg-[var(--muted)]/50 text-[10px] font-black rounded-md border border-[var(--border)] uppercase tracking-wider text-[var(--foreground)]/60">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4 mt-2">
                                        {cert.credential_url ? (
                                            <a
                                                href={cert.credential_url}
                                                target="_blank"
                                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-center text-xs font-black uppercase tracking-[0.2em] rounded-lg shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all outline-none flex items-center justify-center gap-2"
                                            >
                                                Verify ID <ExternalLink size={14} />
                                            </a>
                                        ) : (
                                            <div className="flex-1 py-3 bg-[var(--muted)]/20 text-[var(--foreground-muted)] text-center text-xs font-black uppercase tracking-[0.2em] rounded-lg cursor-not-allowed border border-[var(--border)] opacity-50">
                                                Verification Private
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

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
                                    <ArrowLeft className="rotate-180 sm:w-[32px] sm:h-[32px]" />
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
                                        Archive Record: {lightboxState.certId.slice(0, 8)}-{lightboxState.currentIndex === 0 ? 'CERT' : `IMG-0${lightboxState.currentIndex + 1}`}
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
        </div>
    );
}
