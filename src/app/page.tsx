"use client";

import React from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ProjectShowcase from "@/components/ProjectShowcase";
import Skills from "@/components/Skills";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Systemic Background Architecture */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px] translate-y-1/2"></div>
      </div>

      <div className="relative z-10">
        <HeroSection />
        <div id="projects">
          <ProjectShowcase />
        </div>
        <Skills />

        <section id="contact" className="relative py-20 overflow-hidden mx-6 lg:mx-12 mb-20 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)]/30 backdrop-blur-3xl shadow-2xl">
          {/* Inner Accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>

          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-5 py-2 mb-8 text-xs font-black uppercase tracking-[0.3em] bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20"
              >
                <Sparkles size={12} />
                <span>Available for New Ventures</span>
              </motion.div>

              <h2 className="text-4xl sm:text-7xl font-black mb-6 sm:mb-8 tracking-tighter leading-[0.9] sm:leading-[0.8] uppercase">
                Let&apos;s Architect <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  Your Vision
                </span>
              </h2>

              <p className="text-sm md:text-xl text-[var(--foreground-muted)] mb-10 sm:mb-12 leading-relaxed font-medium max-w-2xl mx-auto border-l-2 border-blue-500/30 pl-5 sm:pl-8">
                Ready for high-impact deployment. Let&apos;s bridge the gap between engineering complexity and sophisticated digital ecosystems together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/contact"
                  className="group w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Inquire Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="mailto:wiraphat.makwong@gmail.com"
                  className="w-full sm:w-auto px-12 py-6 bg-[var(--muted)]/20 text-[var(--foreground)] border border-[var(--border)] text-sm font-black uppercase tracking-widest rounded-xl hover:bg-blue-500/10 hover:border-blue-500/30 transition-all active:scale-95 flex items-center justify-center"
                >
                  Direct Transmission
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}