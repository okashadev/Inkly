"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    "Technology",
    "Design",
    "Programming",
    "AI",
    "Startups",
    "Productivity",
  ];

  return (
    <div
      className={`fixed top-0 w-full z-50 flex justify-center ${
        scrolled ? `shadow` : `shadow-2xl`
      }`}
    >
      <motion.nav
        initial={false}
        animate={{
          marginTop: scrolled ? 16 : 8,
          borderRadius: scrolled ? "50px" : "0px",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          backgroundColor: scrolled
            ? "rgba(20,20,20,0.7)"
            : "rgba(0,0,0,0)",
          border: scrolled
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid rgba(255,255,255,0)",
          boxShadow: scrolled
            ? "0px 20px 60px rgba(0,0,0,0.4)"
            : "0px 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex w-[95%] justify-between items-center h-16 px-8"
      >
        {/* Logo */}
        <div className="text-xl font-bold text-white font-manrope">
          Inkly
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-8 items-center">

          {/* Home */}
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            Home
          </Link>

          {/* Blog */}
          <Link href="/blog" className="text-sm text-white/70 hover:text-white">
            Blog
          </Link>

          {/* ✅ Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown(true)}
            onMouseLeave={() => setOpenDropdown(false)}
          >
            <span className="text-sm text-white/70 hover:text-white cursor-pointer">
              Categories
            </span>

            <AnimatePresence>
              {openDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 16, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-4 w-64 p-4 rounded-2xl bg-[#131B2E] backdrop-blur-xl border border-white/20 shadow-2xl"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/category/${cat.toLowerCase()}`}
                        className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Authors */}
          <Link
            href="/authors"
            className="text-sm text-white/70 hover:text-white"
          >
            Authors
          </Link>
        </div>

        {/* Actions */}
        <div className="flex gap-4 items-center">
          {/* Search */}
          <div className="hidden md:flex items-center bg-white/10 px-3 py-2 rounded-full backdrop-blur-md">
            <FaSearch className="text-white/60 text-sm mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-white placeholder-white/50 w-32"
            />
          </div>

          {/* CTA */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/register"
              className="px-5 py-2 rounded-full bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black font-medium hover:from-[#4d8eff] hover:to-[#adc6ff]"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}