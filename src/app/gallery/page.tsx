"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";

const images = [
  {
    src: "/projects/bonniecraft.png",
    alt: "Bonniecraft Minecraft Store",
    category: "E-Commerce",
  },
  {
    src: "/projects/zpleumverify.png",
    alt: "zPleumVerify",
    category: "Security",
  },
  {
    src: "/projects/zpleumcore.png",
    alt: "zPleumCORE",
    category: "Security",
  },
  {
    src: "/profile.png",
    alt: "Profile",
    category: "Personal",
  },
];

const categories = ["All", ...Array.from(new Set(images.map(img => img.category)))];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredImages = selectedCategory === "All"
    ? images
    : images.filter(img => img.category === selectedCategory);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        </div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          />
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-24 py-24">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--accent-blue)]/30 rounded-full shadow-lg">
              <ImageIcon size={16} className="text-[var(--accent-blue)]" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Visual Showcase
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Gallery
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed">
              A visual collection of my work, projects, and creative endeavors.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${selectedCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                  : "bg-[var(--card-bg)]/80 backdrop-blur-sm text-[var(--foreground)] hover:bg-[var(--card-bg)] hover:shadow-md border border-[var(--border)]"
                  }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Masonry Gallery Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="break-inside-avoid group relative cursor-pointer"
                onClick={() => setSelectedImage(index)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-[var(--card-bg)]/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--border)]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-2">
                          {image.category}
                        </span>
                        <h3 className="text-white font-bold text-lg">{image.alt}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-[var(--foreground-muted)]">No images found in this category.</p>
            </motion.div>
          )}
        </main>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all"
          >
            <X size={24} />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-6xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-2">
                {filteredImages[selectedImage].category}
              </span>
              <h3 className="text-white text-2xl font-bold">
                {filteredImages[selectedImage].alt}
              </h3>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}