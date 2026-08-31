"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import Link from "next/link";
import Image from "next/image";
import Spinner from "@/components/home/Spinner";
import { useSession } from "next-auth/react";
import { User } from "@/types/user";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiBookmark,
  HiArrowsUpDown,
  HiBookmarkSlash,
} from "react-icons/hi2";
import { formatTimeAgo } from "@/utils/formatTime";

interface SavedBlogItem {
  id: string;
  postId: string;
  createdAt: string;
  post?: {
    id: string;
    title: string;
    coverImage?: string | null;
    category?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export default function SavedActivity() {
  const { data: session, status } = useSession();
  const user = session?.user as User;

  const [savedBlogs, setSavedBlogs] = useState<SavedBlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/activity/saved");
        const data = await res.json();

        if (data.success && Array.isArray(data.savedBlogs)) {
          setSavedBlogs(data.savedBlogs);
        }
      } catch (error) {
        console.error("Failed to fetch saved blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchSavedBlogs();
    }
  }, [status]);

  const sortedBlogs = [...savedBlogs].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <DashboardShell user={user}>
      <main className="lg:pl-64 pt-20 transition-all duration-300 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          <Link
            href="/user/settings"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition group"
          >
            <HiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Settings
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 shrink-0">
                  <HiBookmark className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Saved Bookmarks
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                    Articles and guides saved to your reading list.
                  </p>
                </div>
              </div>

              {/* Sort Filter Dropdown */}
              {savedBlogs.length > 0 && (
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131C35] border border-white/10 rounded-xl text-xs text-slate-300">
                    <HiArrowsUpDown className="w-3.5 h-3.5 text-purple-400" />
                    <select
                      value={sortOrder}
                      onChange={(e) =>
                        setSortOrder(e.target.value as "desc" | "asc")
                      }
                      className="bg-transparent outline-none cursor-pointer text-xs text-white"
                    >
                      <option value="desc" className="bg-[#131C35] text-white">
                        Newest First
                      </option>
                      <option value="asc" className="bg-[#131C35] text-white">
                        Oldest First
                      </option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Content Cards */}
            <div className="space-y-3">
              {sortedBlogs && sortedBlogs.length > 0 ? (
                sortedBlogs.map((savedBlog) => (
                  <Link
                    key={savedBlog.id}
                    href={`/blog/${savedBlog?.postId}`}
                    className="group flex items-center gap-4 p-3.5 bg-[#131C35]/60 hover:bg-[#1C2745] rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-200 shadow-sm"
                  >
                    {/* Cover Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                      <Image
                        src={
                          savedBlog.post?.coverImage ||
                          "/images/blog-placeholder.webp"
                        }
                        alt={savedBlog.post?.title || "Saved blog cover"}
                        fill
                        sizes="(max-width: 640px) 80px, 96px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md font-semibold tracking-wide uppercase">
                          {savedBlog.post?.category?.name || "General"}
                        </span>
                        <span className="text-slate-500 text-[10px]">•</span>
                        <span className="text-[11px] text-slate-400">
                          Saved {formatTimeAgo(savedBlog.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {savedBlog.post?.title || "Untitled Article"}
                      </h3>
                    </div>

                    {/* Right Side Icon Indicator */}
                    <div className="pr-2 hidden sm:block text-slate-500 group-hover:text-purple-400 transition-colors">
                      <HiBookmark className="w-5 h-5" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400">
                    <HiBookmarkSlash className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-300 font-medium text-sm sm:text-base">
                      No saved bookmarks found
                    </p>
                    <p className="text-slate-500 text-xs">
                      Articles you save for later reading will show up here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </DashboardShell>
  );
}
