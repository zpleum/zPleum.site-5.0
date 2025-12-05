"use client";

import React from "react";
import HeroSection from "@/components/HeroSection";
import ProjectShowcase from "@/components/ProjectShowcase";
import Skills from "@/components/Skills";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <HeroSection />
      <ProjectShowcase />
      <Skills />

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
    </main>
  );
}