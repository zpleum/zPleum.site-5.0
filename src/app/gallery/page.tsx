"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, ArrowLeft, Image as ImageIcon, FolderX } from "lucide-react";
import Link from "next/link";

type GalleryImage = {
    id: string;
    src: string;
    alt: string;
    category: string;
};

interface Project {
    id: string;
    title: string;
    image_url?: string | null;
    category?: string;
    images?: string[] | null;
}

export default function Gallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    useEffect(() => {
        fetchGalleryImages();
    }, []);

    const fetchGalleryImages = async () => {
        try {
            // Fetch Projects (DB), Certificates (DB), and Raw Images (FS) in parallel
            const [projectsRes, certificatesRes, fsImagesRes] = await Promise.all([
                fetch('/api/projects'),
                fetch('/api/certificates'),
                fetch('/api/gallery-images')
            ]);

            let projectImages: { id: string; src: string; alt: string; category: string }[] = [];
            let certificateImages: { id: string; src: string; alt: string; category: string }[] = [];
            const claimedImages = new Set<string>();

            // 1. Process Project Data
            if (projectsRes.ok) {
                const data = await projectsRes.json();
                projectImages = (data.projects || []).flatMap((p: Project) => {
                    const allImages = [];

                    // Add main image
                    if (p.image_url) {
                        const filename = p.image_url.split('/').pop();
                        if (filename) claimedImages.add(filename);

                        allImages.push({
                            id: p.id,
                            src: p.image_url,
                            alt: p.title,
                            category: p.category || 'Web App',
                        });
                    }

                    // Add additional images from the images array
                    if (p.images && Array.isArray(p.images)) {
                        p.images.forEach((img: string, index: number) => {
                            if (img !== p.image_url) {
                                const filename = img.split('/').pop();
                                if (filename) claimedImages.add(filename);

                                allImages.push({
                                    id: `${p.id}_sub_${index}`,
                                    src: img,
                                    alt: `${p.title} - View ${index + 1}`,
                                    category: p.category || 'System View',
                                });
                            }
                        });
                    }

                    return allImages;
                });
            }

            // 2. Process Certificate Data
            if (certificatesRes.ok) {
                const data = await certificatesRes.json();
                certificateImages = (data.certificates || []).flatMap((c: any) => {
                    const allImages = [];
                    // Handle potential JSON parsing for images array
                    let certImages: string[] = [];
                    try {
                        certImages = typeof c.images === 'string' ? JSON.parse(c.images) : (Array.isArray(c.images) ? c.images : []);
                    } catch (e) {
                        certImages = [];
                    }

                    // Add main image
                    if (c.image_url) {
                        const filename = c.image_url.split('/').pop();
                        if (filename) claimedImages.add(filename);

                        allImages.push({
                            id: `cert_${c.id}`,
                            src: c.image_url,
                            alt: c.title,
                            category: c.category || 'Certification',
                        });
                    }

                    // Add additional images
                    certImages.forEach((img: string, index: number) => {
                        if (img !== c.image_url) {
                            const filename = img.split('/').pop();
                            if (filename) claimedImages.add(filename);

                            allImages.push({
                                id: `cert_${c.id}_sub_${index}`,
                                src: img,
                                alt: `${c.title} - Evidence ${index + 1}`,
                                category: 'Credential',
                            });
                        }
                    });

                    return allImages;
                });
            }

            // 3. Process FS Data (Orphaned Images)
            let fsImages: { id: string; src: string; alt: string; category: string }[] = [];
            if (fsImagesRes.ok) {
                const data = await fsImagesRes.json();
                if (data.images && Array.isArray(data.images)) {
                    fsImages = data.images
                        .filter((filename: string) => !claimedImages.has(filename)) // Only add unclaimed images
                        .map((filename: string, index: number) => ({
                            id: `fs_img_${index}`,
                            src: `/projects/${filename}`,
                            alt: 'Visual Archive Asset',
                            category: 'Visual Archive',
                        }));
                }
            }

            // Combine and set - Mix them up slightly or just concat
            setImages([...projectImages, ...certificateImages, ...fsImages]);

        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
            {/* Premium Background Architecture */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent"></div>
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
                            className="group inline-flex items-center gap-3 px-6 py-3 bg-[var(--muted)]/20 hover:bg-purple-500/10 text-sm font-black uppercase tracking-widest rounded-xl border border-[var(--border)] transition-all hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Core Terminal
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                        <div>
                            <div className="inline-flex items-center gap-3 px-6 py-2 mb-6 text-sm font-black uppercase tracking-[0.3em] bg-purple-500/10 text-purple-500 rounded-full border border-purple-500/20">
                                <ImageIcon size={12} />
                                Visual Intelligence Archive
                            </div>
                            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] sm:leading-[0.8] uppercase mb-4">
                                VISUAL <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
                                    GALLERY
                                </span>
                            </h1>
                        </div>
                        <p className="text-sm md:text-lg text-[var(--foreground-muted)] max-w-xl font-medium leading-relaxed lg:mb-4 border-l-2 border-purple-500/30 pl-5 sm:pl-6">
                            A curated sequence of graphical implementations and architectural interfaces. Documenting the aesthetic evolution of digital systems.
                        </p>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="break-inside-avoid h-64 bg-[var(--card-bg)]/30 backdrop-blur-xl rounded-2xl border border-[var(--border)] animate-pulse shadow-2xl"></div>
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-24 h-24 mb-6 rounded-full bg-[var(--muted)]/10 border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] opacity-20">
                            <FolderX size={36} strokeWidth={1} />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.5em] mb-3 opacity-30">Archive Empty</h3>
                        <p className="text-[var(--foreground-muted)] font-medium text-sm">No graphical records found within the current parameters.</p>
                    </motion.div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
                        {images.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.05 }}
                                className="break-inside-avoid group relative cursor-pointer"
                                onClick={() => setSelectedImage(index)}
                            >
                                <div className="relative overflow-hidden rounded-3xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-purple-500/40 transition-all duration-700 shadow-xl hover:shadow-[0_30px_60px_rgba(168,85,247,0.1)]">
                                    {/* Scanline Effect on Hover */}
                                    <div className="absolute inset-0 z-10 pointer-events-none bg-[url('/scanlines.png')] opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700"></div>

                                    <div className="relative w-full aspect-auto overflow-hidden">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            width={800}
                                            height={1000}
                                            className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out shadow-inner"
                                        />

                                        {/* Premium Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 sm:p-6 backdrop-blur-[2px]">
                                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                                <span className="px-2.5 sm:px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] sm:text-sm font-black uppercase tracking-[0.3em] rounded-full border border-purple-500/10">
                                                    {image.category}
                                                </span>
                                                <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest opacity-30">IMG-{image.id.slice(0, 4)}</span>
                                            </div>
                                            <h3 className="text-base sm:text-lg font-black text-[var(--foreground)] uppercase tracking-tighter leading-tight">{image.alt}</h3>

                                            <div className="mt-4 flex items-center gap-3 opacity-40">
                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                                                <div className="w-1 h-1 rounded-full bg-purple-500 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Cinema-Grade Lightbox */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
                    >
                        <div
                            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                            onClick={() => setSelectedImage(null)}
                        />

                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute top-6 sm:top-10 right-6 sm:right-10 p-4 sm:p-6 bg-white/5 rounded-full text-white hover:bg-white/10 transition-all border border-white/10 z-[110] shadow-2xl backdrop-blur-xl"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={24} className="sm:w-[32px] sm:h-[32px]" strokeWidth={3} />
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-6xl aspect-[4/3] md:aspect-video rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5"
                        >
                            <Image
                                src={images[selectedImage].src}
                                alt={images[selectedImage].alt}
                                fill
                                className="object-contain"
                                priority
                            />

                            {/* Lightbox Info Bar */}
                            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-12 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pointer-events-none">
                                <div>
                                    <span className="text-[10px] sm:text-sm font-black text-purple-400 uppercase tracking-[0.4em] mb-2 sm:mb-4 block">Archive Record: {images[selectedImage].id}</span>
                                    <h3 className="text-xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] sm:leading-none">{images[selectedImage].alt}</h3>
                                </div>
                                <div className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white font-black uppercase tracking-[0.2em] text-[10px] sm:text-sm w-fit">
                                    {images[selectedImage].category}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
