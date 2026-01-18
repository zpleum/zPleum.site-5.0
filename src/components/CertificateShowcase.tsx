"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ExternalLink, Award, Calendar } from "lucide-react";
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

    useEffect(() => {
        fetchCertificates();
    }, []);

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

    if (loading) return null; // Or a skeleton if preferred, but for home page clean load is often better
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
                                <Carousel images={cert.images} title={cert.title} />
                            ) : cert.image_url ? (
                                <div className="relative w-full h-full">
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
        </section>
    );
}
