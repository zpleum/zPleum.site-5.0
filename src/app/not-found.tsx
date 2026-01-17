import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center w-full text-center px-4 overflow-hidden">
      <div className="relative">
        <h1 className="text-9xl md:text-[12rem] font-black tracking-tighter text-[var(--foreground)] opacity-5 select-none absolute inset-0 flex items-center justify-center -translate-y-4">
          404
        </h1>
        <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter relative z-10">
          LOST IN <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
            SPACE
          </span>
        </h2>
      </div>

      <p className="text-xl text-[var(--foreground-muted)] max-w-md mx-auto mb-12 font-medium">
        The architectural layout you&apos;re looking for has been moved or doesn&apos;t exist in this dimension.
      </p>

      <Link
        href="/"
        className="group flex items-center gap-3 px-10 py-5 bg-[var(--foreground)] text-[var(--background)] font-black rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
        Return to Reality
      </Link>
    </div>
  );
} 