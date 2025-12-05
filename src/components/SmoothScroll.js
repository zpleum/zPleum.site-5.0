"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            smooth: true,
            wheelMultiplier: 1.1,
            lerp: 0.08,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }, []);

    return <>{children}</>;
}
