"use client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import Link from "next/link";
import Spinner from "@/components/home/Spinner";
import { useSession } from "next-auth/react";
import { User } from "@/types/user";
import { motion } from "framer-motion";
import { HiArrowLeft, HiHeart, HiArrowsUpDown } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { LikedBlogs } from "@/types/likes";
import { formatTimeAgo } from "@/utils/formatTime";
import Image from "next/image";

export default function LikesActivity() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [likedBlogs, setLikedBlogs] = useState<LikedBlogs[] | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const user = session?.user as User;

  useEffect(() => {
    async function getLikedBlogs() {
      try {
        setLoading(true);
        const res = await fetch("/api/user/activity/likes", {
          method: "GET",
        });

        if (res.status === 200) {
          const resData = await res.json();
          if (resData.success) {
            setLikedBlogs(resData?.likedBlogs);
          }
          console.log(resData);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getLikedBlogs();
  }, []);

  // Client-side Sort Logic
  const sortedBlogs = likedBlogs
    ? [...likedBlogs].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      })
    : [];

  if (loading) {
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
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 shrink-0">
                  <HiHeart className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Liked Posts
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                    Posts and articles you have appreciated.
                  </p>
                </div>
              </div>

              {/* Sort Filter Dropdown */}
              {likedBlogs && likedBlogs.length > 0 && (
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131C35] border border-white/10 rounded-xl text-xs text-slate-300 hover:border-white/20 transition">
                    <HiArrowsUpDown className="w-3.5 h-3.5 text-red-400" />
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

            {/* Liked Blogs List */}
            <div className="space-y-3">
              {sortedBlogs && sortedBlogs.length > 0 ? (
                sortedBlogs.map((likedBlog) => (
                  <Link
                    key={likedBlog.id}
                    href={`/blog/${likedBlog?.postId}`}
                    className="group flex items-center gap-4 p-3.5 bg-[#131C35]/60 hover:bg-[#1C2745] rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-200"
                  >
                    {/* Cover Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                      <Image
                        src={
                          likedBlog.post?.coverImage ||
                          "/images/blog-placeholder.webp"
                        }
                        alt={likedBlog.post?.title || "Blog cover"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-semibold tracking-wide uppercase">
                          {likedBlog.post?.category?.name || "General"}
                        </span>
                        <span className="text-slate-500 text-[10px]">•</span>
                        <span className="text-[11px] text-slate-400">
                          {formatTimeAgo(likedBlog.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {likedBlog.post?.title}
                      </h3>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-slate-400 text-sm">
                    No liked posts found yet.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </DashboardShell>
  );
}
