"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Terminal, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
            {/* Foundry Background Architecture */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center text-center py-10 md:py-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-3 px-6 py-2.5 mb-8 text-sm font-black uppercase tracking-[0.3em] bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20"
                >
                    <Sparkles size={12} className="text-blue-500" />
                    Available for New Ventures
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black mb-8 leading-[0.9] sm:leading-[0.8] tracking-tighter uppercase"
                >
                    ENGINEERING <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        DIGITAL EXCELLENCE
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-sm md:text-xl text-[var(--foreground-muted)] max-w-2xl mb-12 font-medium leading-relaxed border-l-2 border-blue-500/30 pl-5 sm:pl-8 mx-auto"
                >
                    Architecting secure, scalable, and high-performance full-stack ecosystems.
                    Bridging the gap between complex engineering protocols and premium experiences.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto mb-20"
                >
                    <Link
                        href="/project"
                        className="group w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        Explore Projects
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/contact"
                        className="w-full sm:w-auto px-12 py-6 bg-[var(--card-bg)]/50 backdrop-blur-3xl text-[var(--foreground)] border border-[var(--border)] text-sm font-black uppercase tracking-[0.2em] rounded-xl hover:bg-blue-500/10 hover:border-blue-500/30 transition-all active:scale-95 flex items-center justify-center"
                    >
                        Collaborate
                    </Link>
                </motion.div>

                {/* Technical Feature Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left w-full"
                >
                    {[
                        { icon: Terminal, title: "Architecture", desc: "Building from metal to pixel." },
                        { icon: Shield, title: "Security Protocols", desc: "Prioritizing protection always." },
                        { icon: Zap, title: "Optimization", desc: "Scalable performance & speed." }
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center sm:items-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl bg-[var(--card-bg)]/30 backdrop-blur-3xl border border-[var(--border)] hover:bg-[var(--card-bg)]/50 hover:border-blue-500/30 transition-all duration-500 shadow-xl group">
                            <div className="p-3 sm:p-3.5 rounded-xl bg-blue-500/10 text-blue-500 h-fit group-hover:scale-110 transition-transform duration-500">
                                <feature.icon size={20} className="sm:w-[22px] sm:h-[22px]" />
                            </div>
                            <div>
                                <h3 className="font-black text-xs sm:text-sm uppercase tracking-widest mb-1 text-[var(--foreground)]">{feature.title}</h3>
                                <p className="text-[10px] sm:text-sm text-[var(--foreground-muted)] font-black uppercase tracking-tight opacity-40">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
