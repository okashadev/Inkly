"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-8 overflow-hidden bg-[#0b1326]">
      {/* Background Glows */}
      <div className="absolute w-125 h-125 bg-blue-600/15 blur-[140px] -top-20 -left-20 rounded-full pointer-events-none" />
      <div className="absolute w-100 h-100 bg-indigo-600/10 blur-[120px] bottom-0 right-0 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center z-10 py-12">
        {/* Left Column: Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            The Modern Publishing Platform
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight">
            Write.
            <br />
            Publish.
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-300">
              Inspire.
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
            Inkly makes blogging seamless for creators. A minimalist workspace
            designed for modern writers, developers, and thinkers to craft their
            legacy.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/authors"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all duration-300"
            >
              Explore Authors
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Hero Graphic/Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="relative w-full max-w-130 aspect-4/3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#131c35]/50 backdrop-blur-sm group">
            <Image
              src="/assets/img/hero-section-img.png"
              alt="Inkly Workspace Preview"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0b1326] via-transparent to-transparent opacity-60" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}