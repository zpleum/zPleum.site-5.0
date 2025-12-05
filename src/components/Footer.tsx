"use client";

import React from "react";
import { Github, Linkedin, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Footer = () => {
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
              href="https://github.com/zPleum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/wiraphat-makwong"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:contact@zpleum.site"
              className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a
              href="https://www.facebook.com/wiraphat.makwong"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)]/70 hover:text-[#1877F2] transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/zpleum.tsx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)]/70 hover:text-[#E4405F] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://discord.com/users/837918998242656267"
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

        <div className="mt-8 pt-8 border-t border-[var(--border)] text-center md:text-left">
          <p className="text-sm text-[var(--foreground)]/50">
            &copy; {new Date().getFullYear()} Wiraphat Makwong. Licensed under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
