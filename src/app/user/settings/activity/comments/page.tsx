"use client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import Link from "next/link";
import Spinner from "@/components/home/Spinner";
import { useSession } from "next-auth/react";
import { User } from "@/types/user";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiArrowLeft,
  HiChatBubbleLeftEllipsis,
  HiEllipsisVertical,
  HiTrash,
} from "react-icons/hi2";
import { useEffect, useState, useRef } from "react";
import { Comment } from "@/types/comment";
import { formatTimeAgo } from "@/utils/formatTime";
import Image from "next/image";
import { toast } from "sonner";

export default function CommentsActivity() {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"newest" | "oldest">("newest");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const user = session?.user as User;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
      try {
        const res = await fetch("/api/user/activity/comment", {
          method: "GET",
        });

        if (res.ok) {
          const resData = await res.json();
          if (resData.success) {
            setComments(resData.userComments);
          }
        }
      } catch (error: any) {
        console.error("Error fetching Comments", error);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/post/comment/delete/${commentToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const resData = await res.json();
        toast.success(resData.message || "Comment deleted successfully!");

        setComments((prev) =>
          prev.filter((item) => item.id !== commentToDelete),
        );
      }
    } catch (error: any) {
      console.error("Failed to delete comment:", error);
      toast.error("Something went wrong while deleting.");
    } finally {
      setIsDeleting(false);
      setCommentToDelete(null);
      setActiveMenuId(null);
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return filter === "newest" ? dateB - dateA : dateA - dateB;
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shrink-0">
                  <HiChatBubbleLeftEllipsis className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Your Comments
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                    History of your recent discussions across Inkly.
                  </p>
                </div>
              </div>

              <div className="self-end sm:self-center">
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as "newest" | "oldest")
                  }
                  className="bg-[#1C2745] text-xs sm:text-sm text-slate-300 border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 transition cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {sortedComments.length > 0 ? (
                sortedComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-[#131C35]/60 hover:bg-[#1C2745] rounded-2xl border border-white/5 transition-all duration-200 space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {comment.post?.coverImage && (
                          <div className="relative w-12 h-12 rounded-none overflow-hidden shrink-0 border border-white/10">
                            <Image
                              src={comment.post.coverImage}
                              alt={comment.post.title || "Post thumbnail"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <Link
                            href={`/blog/${comment.postId}#comments-section`}
                            className="text-sm sm:text-base font-semibold text-slate-100 hover:text-blue-400 transition-colors line-clamp-1"
                          >
                            {comment.post?.title}
                          </Link>
                          <p className="text-[11px] text-slate-400">
                            Commented {formatTimeAgo(comment.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="relative shrink-0">
                        <button
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === comment.id ? null : comment.id,
                            )
                          }
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                        >
                          <HiEllipsisVertical className="w-5 h-5" />
                        </button>

                        {activeMenuId === comment.id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 mt-1 w-36 bg-[#0F172A] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden py-1"
                          >
                            <button
                              onClick={() => setCommentToDelete(comment.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition text-left"
                            >
                              <HiTrash className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-[#0F172A]/70 rounded-xl border border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                      "{comment.content}"
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-slate-400 text-sm">No comments found.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {commentToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1C2745] border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">
                    Delete Comment?
                  </h3>
                  <p className="text-xs text-slate-300 leading-normal">
                    Are you sure you want to delete this comment? This action
                    cannot be undone.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setCommentToDelete(null)}
                    disabled={isDeleting}
                    className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteComment}
                    disabled={isDeleting}
                    className="px-4 py-2 text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </DashboardShell>
  );
}
