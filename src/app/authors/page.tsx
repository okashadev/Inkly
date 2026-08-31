"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Search,
  UserPlus,
  BookOpen,
  Users,
  Sparkles,
  Loader2,
  UserX,
} from "lucide-react";

interface Author {
  id: string;
  name: string;
  username: string;
  image?: string | null;
  bio?: string | null;
  _count?: {
    posts: number;
    followers: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorsPage() {
  const [search, setSearch] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/authors/search?q=${encodeURIComponent(search)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setAuthors(data);
        }
      } catch (error) {
        console.error("Failed to fetch authors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchAuthors();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#060e20] text-[#dae2fd] flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* HERO / SEARCH HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Community Creators
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
            Discover Tech Authors
          </h1>

          <p className="text-slate-400 text-base sm:text-lg mb-8">
            Explore writers, engineers, and creators sharing insights on
            software, design, and architecture.
          </p>

          <div className="relative max-w-xl mx-auto">
            <div className="relative flex items-center bg-[#131c35] rounded-2xl px-6 py-5 min-h-15 border border-white/10 focus-within:border-blue-500 transition-all shadow-xl">
              <Search className="w-6 h-6 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search authors"
                className="bg-transparent w-full px-4 text-base text-white placeholder-slate-500 outline-none"
              />
              {isLoading && (
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin mr-2 shrink-0" />
              )}
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="px-3 py-1 text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </motion.header>

        <section>
          {isLoading && authors.length === 0 ? (
            <div className="flex justify-center items-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : authors.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[#0b132b]/40 rounded-2xl border border-white/5 max-w-lg mx-auto flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
                <UserX className="w-6 h-6" />
              </div>
              <p className="text-slate-300 font-medium text-base">
                {search.trim()
                  ? `No authors found matching "${search}"`
                  : "No recommended authors available right now"}
              </p>
              <p className="text-slate-500 text-xs">
                {search.trim()
                  ? "Double check spelling or try searching for another username."
                  : "Check back later for new creator suggestions!"}
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {authors.map((author) => (
                <motion.div
                  key={author.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="bg-[#0b132b] p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-200 shadow-xl"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={author.image || "/images/userImage.webp"}
                        alt={author.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/20 bg-[#131c35]"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                          {author.name}
                        </h3>
                        <p className="text-xs text-blue-400 font-medium">
                          @{author.username}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-2 mb-5 text-center bg-[#131c35]/50 py-2.5 rounded-xl border border-white/5">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                          <BookOpen className="w-3 h-3" /> Posts
                        </span>
                        <span className="text-sm font-bold text-white">
                          {author._count?.posts ?? 0}
                        </span>
                      </div>
                      <div className="border-l border-white/10">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                          <Users className="w-3 h-3" /> Followers
                        </span>
                        <span className="text-sm font-bold text-white">
                          {author._count?.followers ?? 0}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/authors/profile/${author.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition active:scale-95 shadow-md shadow-blue-600/20"
                    >
                      View Profile
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
