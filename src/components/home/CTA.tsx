"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const CTA = () => {
  return (
    <section className="relative py-24 px-4 sm:px-8 bg-[#0b1326] text-white text-center overflow-hidden">
      {/* Background Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 blur-[140px] rounded-full"
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto relative z-10 space-y-6"
      >
        <motion.h2
          variants={item}
          className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight"
        >
          Start your writing journey today
        </motion.h2>

        <motion.p
          variants={item}
          className="text-slate-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed"
        >
          Join a community of digital architects crafting their legacy on the
          most elegant publishing platform.
        </motion.p>

        <motion.div variants={item} className="pt-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-9 py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTA;