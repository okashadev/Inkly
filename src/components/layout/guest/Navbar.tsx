"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
}

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setCategories(resData.data);
        }
      })
      .catch((err) => console.error("Error loading categories:", err));

    }, []);
    
    // console.log(categories);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold text-white font-manrope flex justify-center items-center gap-4">
          <Spinner />
          Inkly
        </div>
      </div>
    );
  }

  // const categories = [
  //   "Technology",
  //   "Design",
  //   "Programming",
  //   "AI",
  //   "Startups",
  //   "Productivity",
  // ];

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
          backgroundColor: scrolled ? "rgba(20,20,20,0.7)" : "rgba(0,0,0,0)",
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
        <Link href={"/"} className="text-xl font-bold text-white font-manrope">
          Inkly
        </Link>

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
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="text-sm text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all"
                      >
                        {cat.name}
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
          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 w-10 overflow-hidden rounded-full cursor-pointer focus:outline-none ring-2 ring-transparent hover:ring-primary/50 transition-all active:scale-95"
                aria-label="Open profile menu"
              >
                <Image
                  src="/images/avatar.jpg"
                  alt="Alex's avatar"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#171f33] border border-border/30 p-2 shadow-2xl z-50 text-[#dae2fd]"
                  >
                    {/* Header / Label */}
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {session?.user?.name}
                    </div>
                    <p className="px-3 text-xs text-muted-foreground lowercase">
                      {session?.user?.email}
                    </p>

                    <div className="my-1.5 h-px bg-border/20" />

                    {/* Links Group */}
                    <div className="space-y-0.5">
                      <Link
                        href="/user/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex w-full items-center px-3 py-2 text-sm rounded-xl hover:bg-accent/50 hover:text-primary transition-colors cursor-pointer"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/user/my_blogs"
                        onClick={() => setIsOpen(false)}
                        className="flex w-full items-center px-3 py-2 text-sm rounded-xl hover:bg-accent/50 hover:text-primary transition-colors cursor-pointer"
                      >
                        My Blogs
                      </Link>
                      <Link
                        href="/user/settings"
                        onClick={() => setIsOpen(false)}
                        className="flex w-full items-center px-3 py-2 text-sm rounded-xl hover:bg-accent/50 hover:text-primary transition-colors cursor-pointer"
                      >
                        Settings
                      </Link>
                    </div>

                    {/* Separator Line */}
                    <div className="my-1.5 h-px bg-border/20" />

                    {/* Logout Button */}
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center px-3 py-2 text-sm text-red-400 rounded-xl hover:bg-red-500/10 focus:bg-red-500/10 transition-colors cursor-pointer text-left font-medium"
                    >
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="px-5 py-2 rounded-full bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black font-medium hover:from-[#4d8eff] hover:to-[#adc6ff]"
              >
                Get Started
              </Link>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </div>
  );
}
