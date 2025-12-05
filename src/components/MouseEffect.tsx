"use client";
import { useEffect, useRef } from "react";

export default function MouseEffect() {
  const targetX = useRef(50);
  const targetY = useRef(50);
  const currentX = useRef(50);
  const currentY = useRef(50);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    const lerp = (start: number, end: number, amt: number) => {
      return start + (end - start) * amt;
    };

    const handler = (e: MouseEvent) => {
      targetX.current = (e.clientX / window.innerWidth) * 100;
      targetY.current = (e.clientY / window.innerHeight) * 100;
    };

    const animate = () => {
      // ค่อย ๆ ขยับ currentX,Y เข้าใกล้ targetX,Y แบบหนืด ๆ
      currentX.current = lerp(currentX.current, targetX.current, 0.0250);
      currentY.current = lerp(currentY.current, targetY.current, 0.0250);

      document.documentElement.style.setProperty('--mouse-x', `${currentX.current}%`);
      document.documentElement.style.setProperty('--mouse-y', `${currentY.current}%`);

      animationFrame.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handler);
    animate();

    return () => {
      document.removeEventListener("mousemove", handler);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return null;
}
