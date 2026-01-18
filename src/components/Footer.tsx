"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, Facebook, Instagram, MessageCircle, LayoutDashboard } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({
    github_url: 'https://github.com/zPleum',
    linkedin_url: 'https://linkedin.com/in/wiraphat-makwong',
    facebook_url: 'https://www.facebook.com/wiraphat.makwong',
    instagram_url: 'https://www.instagram.com/zpleum.tsx',
    discord_url: 'https://discord.com/users/837918998242656267',
    email: 'contact@zpleum.site'
  });

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) {
          setSocialLinks({
            github_url: data.profile.github_url || 'https://github.com/zPleum',
            linkedin_url: data.profile.linkedin_url || 'https://linkedin.com/in/wiraphat-makwong',
            facebook_url: data.profile.facebook_url || 'https://www.facebook.com/wiraphat.makwong',
            instagram_url: data.profile.instagram_url || 'https://www.instagram.com/zpleum.tsx',
            discord_url: data.profile.discord_url || 'https://discord.com/users/837918998242656267',
            email: data.profile.email || 'contact@zpleum.site'
          });
        }
      })
      .catch(err => console.error('Error fetching social links:', err));
  }, []);

  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border)] py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-4xl font-bold text-[var(--foreground)] tracking-tight font-[family-name:var(--font-sov-rangbab)]">zPleum</span>
            <p className="text-sm text-[var(--foreground)]/60">
              Building digital experiences with purpose.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Social Links */}
            <a
              href={socialLinks.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={socialLinks.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={`mailto:${socialLinks.email}`}
              className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a
              href={socialLinks.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)]/70 hover:text-[#1877F2] transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href={socialLinks.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)]/70 hover:text-[#E4405F] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href={socialLinks.discord_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)]/70 hover:text-[#5865F2] transition-colors"
              aria-label="Discord"
            >
              <MessageCircle size={20} />
            </a>

            {/* Divider */}
            <div className="w-px h-6 bg-[var(--border)]"></div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--foreground)]/50">
            &copy; {new Date().getFullYear()} Wiraphat Makwong. Licensed under MIT License.
          </p>
          <Link
            href="/admin/dashboard"
            className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]/30 hover:text-[var(--primary)] transition-all flex items-center gap-2 group"
          >
            <LayoutDashboard size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
