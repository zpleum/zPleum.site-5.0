"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientThemeWrapper({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <ThemeProvider>
            {mounted && <Header />}
            {children}
            {mounted && <Footer />}
        </ThemeProvider>
    );
}
