"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CarouselProps {
    images: string[];
    title: string;
    onImageClick?: (src: string, alt: string, index: number) => void;
}

export default function Carousel({ images, title, onImageClick }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="relative w-full h-full group/carousel cursor-zoom-in" onClick={() => onImageClick?.(images[currentIndex], `${title} - View ${currentIndex + 1}`, currentIndex)}>
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Image
                        src={img}
                        alt={`${title} - View ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                </div>
            ))}

            {/* Navigation Controls */}
            {images.length > 1 && (
                <>
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-10">
                        <button
                            onClick={prevSlide}
                            className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
                        >
                            <ArrowRight className="rotate-180" size={20} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(idx);
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
