"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Facebook,
  MessageCircle,
  Code,
  Briefcase,
  Sparkles,
  Heart,
  Rocket,
  Target,
  ArrowLeft
} from "lucide-react";
import Skills from "@/components/Skills";

const iconMap: Record<string, React.ComponentType<any>> = { // eslint-disable-line @typescript-eslint/no-explicit-any
  Briefcase,
  Code,
  Heart,
  Rocket,
  Target,
  Sparkles
};

interface Stat {
  id?: string;
  icon: string;
  value: string;
  label: string;
  color: string;
}

interface Milestone {
  id?: string;
  year: string;
  title: string;
  description: string;
  align: 'left' | 'right';
}

export default function About() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [profile, setProfile] = useState({ full_name: 'Wiraphat Makwong', profile_image_url: '/profile.png' });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data.stats || []))
      .catch(err => console.error('Error fetching stats:', err));

    fetch('/api/journey')
      .then(res => res.json())
      .then(data => setMilestones(data.milestones || []))
      .catch(err => console.error('Error fetching journey milestones:', err));

    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data.profile || { full_name: 'Wiraphat Makwong', profile_image_url: '/profile.png' }))
      .catch(err => console.error('Error fetching profile:', err));
  }, []);
  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Premium Background Architecture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-20">
        {/* Navigation & Label */}
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

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-3 px-6 py-2 mb-6 text-sm font-black uppercase tracking-[0.3em] bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">
                <Sparkles size={12} className="text-blue-500" />
                Entity Intelligence Schema
              </div>
              <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] sm:leading-[0.8] uppercase mb-4">
                SYSTEM <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  ARCHITECT
                </span>
              </h1>
            </div>
            <p className="text-sm md:text-lg text-[var(--foreground-muted)] max-w-xl font-medium leading-relaxed lg:mb-4 border-l-2 border-blue-500/30 pl-5 sm:pl-6">
              A detailed record of digital evolution. Orchestrating high-impact engineering solutions and sophisticated cloud architectures with surgical precision and creative vision.
            </p>
          </div>
        </motion.div>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mb-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-widest bg-[var(--card-bg)]/80 backdrop-blur-md border border-[var(--border)] rounded-full text-[var(--foreground)] shadow-xl">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              Architecting the Web
            </div>

            <h2 className="text-3xl sm:text-6xl font-black tracking-tighter mb-6 uppercase leading-[0.9] sm:leading-none">
              {profile.full_name.split(' ')[0]} <br />
              {profile.full_name.split(' ').slice(1).join(' ')}
            </h2>

            <p className="text-base sm:text-xl text-[var(--foreground-muted)] font-medium leading-relaxed mb-8 max-w-lg">
              Full Stack Engineer based in Thailand, dedicated to building high-performance digital ecosystems and secure neural modules.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="group w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                Let&apos;s Build
              </Link>
              <div className="flex gap-2">
                {[
                  { icon: Github, href: "https://github.com/zPleum" },
                  { icon: Facebook, href: "https://www.facebook.com/wiraphat.makwong" },
                  { icon: MessageCircle, href: "https://discord.com/users/837918998242656267" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 sm:p-4 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl text-[var(--foreground-muted)] hover:text-blue-500 transition-all hover:scale-110 shadow-xl"
                  >
                    <social.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square relative rounded-[2.5rem] overflow-hidden border-4 border-[var(--card-bg)] shadow-2xl grayscale hover:grayscale-0 transition-all duration-[1.5s] ease-out group">
              <Image
                src={profile.profile_image_url}
                alt={profile.full_name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
            {/* Absolute Badges */}
            <div className="absolute -bottom-4 -left-4 bg-[var(--card-bg)]/80 backdrop-blur-3xl px-6 py-4 rounded-2xl border border-[var(--border)] shadow-2xl">
              <p className="text-sm font-black uppercase tracking-widest opacity-30 mb-1">Current Protocol</p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-50"></div>
                </div>
                <span className="text-sm font-black text-green-500 uppercase tracking-widest">Open for Ventures</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {stats.map((stat, i) => {
            const IconComponent = iconMap[stat.icon] || Briefcase;
            return (
              <motion.div
                key={stat.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--card-bg)]/30 hover:bg-[var(--card-bg)]/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-[var(--border)] transition-all duration-500 shadow-xl group"
              >
                <IconComponent size={20} className={`sm:w-[24px] sm:h-[24px] text-${stat.color}-500 mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className="text-2xl sm:text-4xl font-black tracking-tighter mb-1 uppercase">{stat.value}</h3>
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] opacity-30">{stat.label}</p>
              </motion.div>
            );
          })}
        </section>

        {/* Narrative Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-black tracking-tighter mb-6 uppercase">
              The <span className="text-blue-500">Mission</span>
            </h3>
            <div className="h-1 w-12 bg-blue-500 mb-6"></div>
            <p className="text-base text-[var(--foreground-muted)] font-medium leading-relaxed">
              Bridging the gap between complex engineering protocols and high-fidelity user experiences. Every line of code is an architectural statement.
            </p>
          </div>
          <div className="lg:col-span-2 space-y-6 text-base sm:text-lg font-medium leading-relaxed text-[var(--foreground)] border-l-2 sm:border-l border-[var(--border)] pl-5 sm:pl-12">
            <p>
              With over 5 years of professional deployment experience, I specialize in building <span className="text-blue-500 font-black">high-concurrency systems</span> and secure digital ecosystems. My background spans from Minecraft infrastructure to complex E-commerce billing engines.
            </p>
            <p>
              My operational philosophy is absolute: <span className="text-purple-500 font-black">Performance is not an optional feature.</span> Whether architecting security modules or scaling cloud databases, I ensure every system is optimized for maximal efficiency and load durability.
            </p>
          </div>
        </section>

        {/* Skills Deep Dive */}
        <Skills />

        {/* The Journey Section */}
        <section className="relative">
          <div className="flex flex-col gap-4 md:gap-6 mb-12 md:mb-20">
            <h2 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase leading-[0.9] sm:leading-[0.8]">THE <br /><span className="text-blue-500 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">JOURNEY</span></h2>
          </div>

          <div className="relative pl-8 md:pl-0">
            {/* Main Vertical Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-20 hidden md:block"></div>

            <div className="space-y-2">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-12 ${milestone.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-[-32px] md:left-1/2 md:-translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-20">
                    <div className="w-4 h-4 rounded-full bg-[var(--background)] border-4 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Content Block */}
                  <div className={`w-full md:w-[45%] ${milestone.align === 'left' ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="relative group">
                      <div className="relative z-10 bg-[var(--card-bg)]/50 backdrop-blur-xl p-5 sm:p-8 rounded-3xl border border-[var(--border)] hover:bg-[var(--card-bg)] hover:-translate-y-2 hover:border-blue-500/30 transition-all duration-500 shadow-sm overflow-hidden">
                        {/* Large Year Accent inside card */}
                        <div className={`absolute top-[-5px] sm:top-[-10px] ${milestone.align === 'left' ? 'left-[-5px] sm:left-[-10px]' : 'right-[-5px] sm:right-[-10px]'} text-5xl sm:text-8xl font-black opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none`}>
                          {milestone.year}
                        </div>
                        <div className={`flex flex-col ${milestone.align === 'left' ? 'md:items-end' : 'md:items-start'} mb-4`}>
                          <span className="text-2xl sm:text-4xl font-black tracking-tighter text-blue-500/50 mb-1">{milestone.year}</span>
                          <h3 className="text-lg sm:text-2xl font-black tracking-tight uppercase">{milestone.title}</h3>
                        </div>
                        <p className="text-xs sm:text-lg text-[var(--foreground-muted)] font-medium leading-relaxed italic border-l-2 border-blue-500/20 pl-4">
                          &ldquo;{milestone.description}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Empty space for the other side on desktop */}
                  <div className="hidden md:block w-[45%]"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div >
  );
}