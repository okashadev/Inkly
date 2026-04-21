"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="hidden md:flex gap-8">
          {["Home", "Blog", "Categories", "Authors"].map((item) => (
            <motion.div
              key={item}
              whileHover={{ opacity: 1 }}
              initial={{ opacity: 0.6 }}
              className="cursor-pointer text-sm font-medium text-white"
            >
              <Link
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 items-center">
          {/* Search Box */}
          <div className="hidden md:flex items-center bg-white/10 px-3 py-2 rounded-full backdrop-blur-md">
            <FaSearch className="text-white/60 text-sm mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-white placeholder-white/50 w-32"
            />
          </div>

          {/* Get Started Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/register"
              className="px-5 py-2 rounded-full backdrop-blur-md bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black font-medium hover:from-[#4d8eff] hover:to-[#adc6ff]"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}