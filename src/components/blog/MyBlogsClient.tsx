"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

// Types
interface Post {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  readingTime: number;
  published: boolean;
  views: number;
  createdAt: string;
  category: {
    name: string;
  };
}

interface Stats {
  totalBlogs: number;
  draftsCount: number;
  totalViews: number;
}

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function MyBlogsClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBlogs: 0,
    draftsCount: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"All" | "Drafts" | "Published">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let statusParam = "";
      if (activeTab === "Drafts") statusParam = "&status=draft";
      if (activeTab === "Published") statusParam = "&status=published";

      const url = `/api/user/post?search=${encodeURIComponent(searchQuery)}${statusParam}`;
      const res = await fetch(url);
      const data = await res.json();

      console.log(data);

      if (data.success) {
        setPosts(data.posts);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search Debounce & Tab Refresh Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/user/post/delete?id=${postToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Post Deleted Successfully!");
        setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
        setStats((prev) => ({
          ...prev,
          totalBlogs: Math.max(0, prev.totalBlogs - 1),
          draftsCount: postToDelete.published
            ? prev.draftsCount
            : Math.max(0, prev.draftsCount - 1),
        }));
        setPostToDelete(null);
      } else {
        toast.error(data.error || "Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Something went wrong while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  return (
    <main className="md:ml-64 pt-26 px-8 pb-12 min-h-screen bg-[#0F172A] text-white relative">
      {/* Hero Header */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12"
      >
        <motion.div variants={item} className="space-y-2">
          <h2 className="text-5xl font-black tracking-tight">My Blogs</h2>
          <p className="text-[#CBD5F5] text-lg">
            Manage your stories and drafts from a single workspace.
          </p>
        </motion.div>

        <Link href="/user/post/add">
          <motion.button
            variants={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-linear-to-br from-[#3B82F6] to-[#1E40AF] text-white font-bold text-sm uppercase tracking-wide rounded-xl shadow-xl flex items-center gap-2 cursor-pointer"
          >
            Write New
          </motion.button>
        </Link>
      </motion.section>

      {/* Dynamic Stats Cards */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        {[
          {
            title: "Total Blogs",
            value: stats.totalBlogs,
            sub: "All time",
          },
          {
            title: "Total Views",
            value:
              stats.totalViews > 1000
                ? `${(stats.totalViews / 1000).toFixed(1)}k`
                : stats.totalViews,
            sub: "Lifetime reads",
          },
          {
            title: "Drafts Count",
            value: Number(stats.draftsCount) || 0,
            sub: "Ready to publish",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ y: -6 }}
            className="p-8 bg-[#1E293B] rounded-xl border-l-4 border-blue-500/30 transition-all"
          >
            <div className="flex justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-[#CBD5F5]">
                {card.title}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{card.value}</span>
              <span className="text-blue-400 text-xs">{card.sub}</span>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Filters & Search */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 flex flex-col md:flex-row gap-6 items-center"
      >
        <div className="w-full flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E293B] border border-white/5 rounded-xl py-4 pl-6 pr-4 text-white focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
            placeholder="Search by title, category or content..."
          />
        </div>

        {/* Dynamic Status Tabs */}
        <div className="flex bg-[#1E293B] rounded-xl p-1.5 border border-white/5">
          {(["All", "Drafts", "Published"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-sm cursor-pointer transition-all ${
                activeTab === tab
                  ? "bg-blue-500 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Sort Order Toggle */}
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
          }
          className="flex items-center gap-2 bg-[#1E293B] px-6 py-4 rounded-xl border border-white/5 cursor-pointer text-sm font-medium hover:border-white/20 transition-all"
        >
          <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
        </button>
      </motion.section>

      {/* Blog Grid State Render */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">
          Loading workspace blogs...
        </div>
      ) : sortedPosts.length === 0 ? (
        <div className="text-center py-20 bg-[#1E293B]/50 rounded-xl border border-white/5 text-slate-400">
          No blog posts found matching your criteria.
        </div>
      ) : (
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {sortedPosts.map((post) => (
            <motion.article
              key={post.id}
              variants={item}
              whileHover={{ y: -6 }}
              className="group bg-[#1E293B] rounded-xl overflow-hidden transition-all flex flex-col justify-between relative"
            >
              <div>
                {/* Cover Image & Status Badge */}
                <div className="relative aspect-video overflow-hidden bg-slate-800">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                      No Image Attached
                    </div>
                  )}

                  {/* Status Badge */}
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 text-xs rounded-full border font-medium ${
                      post.published
                        ? "bg-green-500/20 border-green-500/30 text-green-400"
                        : "bg-amber-500/20 border-amber-500/30 text-amber-400"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>

                  {/* Three-Dot Menu Button */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === post.id ? null : post.id);
                      }}
                      className="w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
                    >
                      ⋮
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {openMenuId === post.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -5 }}
                          className="absolute right-0 mt-2 w-36 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5"
                        >
                          <Link
                            href={`/user/post/edit/${post.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
                          >
                            ✏️ Edit Post
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              setPostToDelete(post);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                          >
                            🗑️ Delete Post
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                    #{post.category?.name || "General"}
                  </span>

                  <Link href={`/blog/${post.id}`}>
                    <h3 className="text-xl font-bold my-2 group-hover:text-blue-400 transition line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                    {post.description || "No description provided..."}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-white/5 flex justify-between text-xs text-gray-400">
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    • {post.readingTime} min read
                  </span>
                  <span>{post.views} views</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.section>
      )}

      {/* Delete Confirmation Modal Overlay */}
      <AnimatePresence>
        {postToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Delete Post?</h3>
                <p className="text-sm text-slate-400">
                  Are you sure you want to delete{" "}
                  <span className="text-slate-200 font-semibold">
                    "{postToDelete.title}"
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setPostToDelete(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
