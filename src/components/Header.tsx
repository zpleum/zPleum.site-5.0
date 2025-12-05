"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail, Facebook } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/project" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] py-3 shadow-sm"
          : "bg-transparent py-5"
          }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-4xl font-bold text-[var(--foreground)] tracking-tight font-[family-name:var(--font-sov-rangbab)]">
            zPleum
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${pathname === item.href
                  ? "text-[var(--primary)] font-semibold"
                  : "text-[var(--foreground)]/80 hover:text-[var(--primary)]"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Social & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Social Links */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://github.com/zPleum"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/wiraphat-makwong"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.facebook.com/wiraphat.makwong"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--foreground)]/70 hover:text-[#1877F2] transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-[var(--border)]"></div>

            {/* Theme Toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <button
              className="md:hidden p-2 text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[var(--background)] shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="p-5 flex items-center justify-between border-b border-[var(--border)]">
                <span className="font-bold text-lg text-[var(--foreground)]">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 py-6 px-4 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-3 px-4 text-base font-medium rounded-lg transition-colors ${pathname === item.href
                      ? "text-[var(--primary)] font-semibold"
                      : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="p-6 border-t border-[var(--border)]">
                <div className="flex flex-col gap-4">
                  {/* Social Links */}
                  <div className="flex justify-center gap-6">
                    <a
                      href="https://github.com/zPleum"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
                    >
                      <Github size={24} />
                    </a>
                    <a
                      href="https://linkedin.com/in/wiraphat-makwong"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
                    >
                      <Linkedin size={24} />
                    </a>
                    <a
                      href="mailto:contact@zpleum.site"
                      className="text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors"
                    >
                      <Mail size={24} />
                    </a>
                    <a
                      href="https://www.facebook.com/wiraphat.makwong"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--foreground)]/70 hover:text-[#1877F2] transition-colors"
                    >
                      <Facebook size={24} />
                    </a>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-[var(--border)]"></div>

                  {/* Theme Toggle */}
                  <div className="flex justify-center">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
