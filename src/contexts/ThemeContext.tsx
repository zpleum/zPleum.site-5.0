"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        // This IIFE runs once on the client to set the initial theme from localStorage or default to 'dark'
        // It prevents a flash of unstyled content by setting the attribute directly on the documentElement
        (function () {
            const savedTheme = localStorage.getItem('theme');
            const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
            document.documentElement.setAttribute('data-theme', initialTheme);
            // Update React state after initial render
            setTheme(initialTheme as Theme);
        })();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
