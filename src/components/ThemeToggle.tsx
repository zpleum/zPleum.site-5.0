"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

interface ThemeToggleProps {
    className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors hover:bg-[var(--muted)] ${className}`}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {theme === "light" ? (
                    <Moon size={20} className="text-[var(--foreground)]/70" />
                ) : (
                    <Sun size={20} className="text-[var(--foreground)]/70" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
