"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiHome, HiArrowLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-[#131C35]/80 border border-white/10 rounded-2xl p-8 sm:p-10 text-center backdrop-blur-md shadow-2xl relative z-10 space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-widest">
          Inkly • 404
        </div>

        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-300 to-purple-400 tracking-tight">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <HiHome className="w-4 h-4" />
            Go To Home
          </Link>

          <button
           onClick={handleBack}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1C2745] hover:bg-[#223055] text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-semibold uppercase tracking-wider transition active:scale-95"
          >
            <HiArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}