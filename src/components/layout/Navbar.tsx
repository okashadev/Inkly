"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Spinner from "@/components/home/Spinner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

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
        className="flex w-[95%] justify-between items-center h-16 px-4 sm:px-8 relative"
      >
        <Link href={"/"} className="text-xl font-bold text-white font-manrope">
          Inkly
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {/* Blog */}
          <Link
            href="/blog"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Blog
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown(true)}
            onMouseLeave={() => setOpenDropdown(false)}
          >
            <span className="text-sm text-white/70 hover:text-white cursor-pointer py-2">
              Categories
            </span>

            <AnimatePresence>
              {openDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 12, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 p-3 rounded-2xl bg-[#131B2E]/95 backdrop-blur-xl border border-white/20 shadow-2xl z-50"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          className="text-xs text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all line-clamp-1"
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-xs text-white/50 col-span-2 text-center py-2">
                        No categories found
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Authors */}
          <Link
            href="/authors"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Authors
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex gap-4 items-center">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white/10 px-3 py-2 rounded-full backdrop-blur-md border border-white/10 focus-within:border-white/30 transition-all"
          >
            <button type="submit" aria-label="Search">
              <FaSearch className="text-white/60 text-sm mr-2 hover:text-white transition-colors" />
            </button>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm text-white placeholder-white/50 w-28 lg:w-36"
            />
          </form>

          {/* Auth Button / Profile Dropdown */}
          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 w-10 overflow-hidden rounded-full cursor-pointer focus:outline-none ring-2 ring-transparent hover:ring-blue-500/50 transition-all active:scale-95 flex items-center justify-center bg-white/10"
                aria-label="Open profile menu"
              >
                <Image
                  src={session?.user?.image || "/images/userImage.webp"}
                  alt={session?.user?.name || "User Avatar"}
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
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#171f33] border border-white/15 p-2 shadow-2xl z-50 text-[#dae2fd]"
                  >
                    <Link href={`/authors/profile/${session?.user?.id}`}>
                      <div className="px-3 py-2 text-xs font-semibold text-slate-300 uppercase tracking-wider line-clamp-1">
                        {session?.user?.name}
                      </div>
                      <p className="px-3 text-xs text-slate-400 lowercase line-clamp-1">
                        {session?.user?.email}
                      </p>
                    </Link>

                    <div className="my-1.5 h-px bg-white/10" />

                    <div className="space-y-0.5">
                      <Link
                        href="/user/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex w-full items-center px-3 py-2 text-sm rounded-xl hover:bg-white/10 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/user/my_blogs"
                        onClick={() => setIsOpen(false)}
                        className="flex w-full items-center px-3 py-2 text-sm rounded-xl hover:bg-white/10 transition-colors"
                      >
                        My Blogs
                      </Link>
                      <Link
                        href="/user/settings"
                        onClick={() => setIsOpen(false)}
                        className="flex w-full items-center px-3 py-2 text-sm rounded-xl hover:bg-white/10 transition-colors"
                      >
                        Settings
                      </Link>
                    </div>

                    <div className="my-1.5 h-px bg-white/10" />

                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center px-3 py-2 text-sm text-red-400 rounded-xl hover:bg-red-500/10 transition-colors text-left font-medium"
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
                className="px-5 py-2 rounded-full bg-linear-to-r from-blue-400 to-indigo-500 text-slate-950 font-bold text-sm shadow-md hover:brightness-110 transition-all inline-block"
              >
                Get Started
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white text-xl p-2 rounded-xl bg-white/10 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-0 right-0 mx-auto w-full bg-[#11192e]/95 backdrop-blur-2xl border border-white/15 p-5 rounded-2xl shadow-2xl flex flex-col gap-4 z-50 md:hidden"
            >
              {/* Search bar inside mobile menu */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-white/10 px-4 py-2.5 rounded-xl border border-white/10"
              >
                <button type="submit" aria-label="Search mobile">
                  <FaSearch className="text-white/60 text-sm mr-2" />
                </button>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-white placeholder-white/50 w-full"
                />
              </form>

              {/* Navigation Links */}
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-white/80 hover:text-white px-2 py-1"
                >
                  Blog
                </Link>
                <Link
                  href="/authors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-white/80 hover:text-white px-2 py-1"
                >
                  Authors
                </Link>

                {/* Categories Accordion/List */}
                <div className="flex flex-col gap-2 px-2 pt-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Categories
                  </span>
                  <div className="grid grid-cols-2 gap-2 pl-1">
                    {categories.slice(0, 6).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs text-white/70 hover:text-white py-1 line-clamp-1"
                      >
                        • {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10 my-1" />

              {/* User Session or Get Started in Mobile */}
              {session ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-2 py-1">
                    <Link href={`/authors/profile/${session?.user?.id}`}>
                      <Image
                        src={session?.user?.image || "/images/userImage.webp"}
                        alt="User Avatar"
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    </Link>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href="/user/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center text-xs font-semibold bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-xl border border-white/10"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/user/my_blogs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center text-xs font-semibold bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-xl border border-white/10"
                    >
                      My Blogs
                    </Link>
                  </div>

                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full text-center text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-xl border border-red-500/20 mt-1 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-linear-to-r from-blue-400 to-indigo-500 text-slate-950 font-bold text-sm shadow-md"
                >
                  Get Started
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
