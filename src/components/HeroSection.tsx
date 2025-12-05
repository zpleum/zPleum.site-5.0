"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-24">
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
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16"
      >
        {/* Profile Image - Left Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-[var(--card-bg)] shadow-2xl">
            <Image
              src="/profile.png"
              alt="Profile"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Text Content - Right Side */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--accent-blue)]/30 rounded-full shadow-lg"
          >
            <Sparkles size={16} className="text-[var(--accent-blue)]" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Full Stack Developer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--foreground)] mb-6 tracking-tight leading-tight"
          >
            Crafting{" "}
            <span className="font-[family-name:var(--font-sov-khongkhanad)] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Beautiful
            </span>
            <br className="hidden md:block" />
            Digital Experiences
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-[var(--foreground-muted)] mb-8 leading-relaxed"
          >
            Hi, I&apos;m <span className="font-semibold text-[var(--foreground)]">Wiraphat Makwong</span>.
            I build accessible, pixel-perfect, and performant web applications that solve real-world problems with elegant solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center w-full sm:w-auto"
          >
            <a
              href="/project"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">View Projects</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="/contact"
              className="px-8 py-4 bg-[var(--card-bg)]/80 backdrop-blur-sm text-[var(--foreground)] border-2 border-[var(--border)] font-semibold rounded-full hover:bg-[var(--card-bg)] hover:border-[var(--accent-blue)] hover:shadow-lg transition-all duration-300"
            >
              Contact Me
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex gap-8 mt-12 pt-8 border-t border-[var(--border)]"
          >
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">5+</div>
              <div className="text-sm text-[var(--foreground-muted)]">Years Experience</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">50+</div>
              <div className="text-sm text-[var(--foreground-muted)]">Projects Completed</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">100%</div>
              <div className="text-sm text-[var(--foreground-muted)]">Client Satisfaction</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[var(--foreground)]/40 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-[var(--foreground)]/40 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;