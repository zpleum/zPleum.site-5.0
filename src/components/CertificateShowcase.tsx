"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink, Award, Calendar, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Carousel from "./Carousel";

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

export default function CertificateShowcase() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxState, setLightboxState] = useState<{
        images: string[];
        currentIndex: number;
        title: string;
        category?: string;
        certId: string;
    } | null>(null);

    useEffect(() => {
        fetchCertificates();
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

    const fetchCertificates = async () => {
        try {
            const response = await fetch('/api/certificates');
            if (response.ok) {
                const data = await response.json();
                // Parse data and filter for featured only
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const parsedCertificates = data.certificates
                    .map((cert: any) => ({
                        ...cert,
                        skills: typeof cert.skills === 'string' ? JSON.parse(cert.skills) : cert.skills || [],
                        images: typeof cert.images === 'string' ? JSON.parse(cert.images) : cert.images || [],
                        featured: cert.featured === 1 || cert.featured === true || cert.featured === '1' || cert.featured === 'true'
                    }))
                    .filter((cert: Certificate) => cert.featured)
                    .slice(0, 3); // Limit to top 3 featured

                setCertificates(parsedCertificates);
            }
        } catch {
            console.error('Error fetching certificates');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;
    if (certificates.length === 0) return null;

    return (
        <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 mb-10 sm:mb-16">
                <h2 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase leading-[0.9] sm:leading-[0.8]">
                    Selected <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500">License</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert, index) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="group relative bg-[var(--card-bg)]/30 backdrop-blur-3xl rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 border border-[var(--border)] flex flex-col h-full"
                    >
                        {/* Image Area */}
                        <div className="relative h-60 w-full overflow-hidden border-b border-[var(--border)]">
                            {/* Category Pill */}
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
                                    className="relative w-full h-full cursor-zoom-in"
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
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)]/80 via-transparent to-transparent opacity-60"></div>
                                </div>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-teal-500/10 to-emerald-500/10 flex items-center justify-center">
                                    <Award size={48} className="text-teal-500/30" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-1 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-xs font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                                    <Award size={14} />
                                    {cert.issuer}
                                </div>
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider border border-[var(--border)] px-2 py-1 rounded-full">
                                    {cert.date}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black mb-4 group-hover:text-blue-500 transition-colors uppercase leading-[0.95] tracking-tight">
                                {cert.title}
                            </h3>

                            <div className="mt-auto pt-6 flex gap-4">
                                {cert.credential_url ? (
                                    <a
                                        href={cert.credential_url}
                                        target="_blank"
                                        className="flex-1 py-3 bg-[var(--muted)]/20 hover:bg-blue-600 hover:text-white text-[var(--foreground)] text-center text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-[var(--border)] transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        Verify Credential <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                    </a>
                                ) : (
                                    <div className="flex-1 py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
                                        Private Credential
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <Link
                    href="/certificate"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--card-bg)]/30 text-[var(--foreground)] text-sm font-black uppercase tracking-widest rounded-xl border border-[var(--border)] hover:bg-blue-500/10 hover:border-blue-500/30 transition-all active:scale-95 group"
                >
                    View All Licenses
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
                                    <span className="text-[10px] sm:text-sm font-black text-teal-400 uppercase tracking-[0.4em] mb-2 sm:mb-4 block">
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
        </section>
    );
}
