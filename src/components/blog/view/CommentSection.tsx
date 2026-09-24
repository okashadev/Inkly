"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatTimeAgo } from "@/utils/formatTime";

interface CommentAuthor {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
}

interface CommentSectionProps {
  postId: string;
  status: "authenticated" | "unauthenticated" | "loading";
  onAuthRequired: (action: "comment") => void;
  onCommentAdded?: () => void;
}

export default function CommentSection({
  postId,
  status,
  onAuthRequired,
  onCommentAdded,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const controller = new AbortController();

    async function fetchComments() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`/api/post/comment?postId=${postId}`, {
          signal: controller.signal,
        });
        const json = await res.json();

        if (json.success && json.data && Array.isArray(json.data.comments)) {
          setComments(json.data.comments);
        } else if (Array.isArray(json.comments)) {
          setComments(json.comments);
        } else {
          setComments([]);
        }
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching comments:", err);
          setError("Failed to load comments.");
          setComments([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();

    return () => {
      controller.abort();
    };
  }, [postId]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (status === "unauthenticated") {
      onAuthRequired("comment");
      return;
    }

    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/post/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: newComment.trim() }),
      });

      const json = await res.json();

      if (json.success && json.comment) {
        setComments((prev) => [
          json.comment,
          ...(Array.isArray(prev) ? prev : []),
        ]);
        setNewComment("");
        if (onCommentAdded) {
          onCommentAdded();
        }
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeCommentsList = Array.isArray(comments) ? comments : [];

  return (
    <section id="comments-section" className="mt-16 space-y-8">
      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
        Comments ({safeCommentsList.length})
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            status === "unauthenticated"
              ? "Sign in to leave a comment..."
              : "What are your thoughts?"
          }
          onClick={() => {
            if (status === "unauthenticated") {
              onAuthRequired("comment");
            }
          }}
          rows={3}
          className="w-full bg-[#131b2e] text-white placeholder-slate-400 p-4 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition resize-none text-sm"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-slate-800/40 rounded-2xl border border-white/5" />
          <div className="h-20 bg-slate-800/40 rounded-2xl border border-white/5" />
        </div>
      ) : error ? (
        <p className="text-red-400 text-sm font-medium p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          {error}
        </p>
      ) : safeCommentsList.length === 0 ? (
        <p className="text-slate-400 text-sm italic py-4">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#131b2e]/60 backdrop-blur-md shadow-xl"
        >
          {/* Sticky Discussion Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#131b2e]/90 backdrop-blur-xl">
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">
                Recent Discussions
              </h4>
              <p className="text-[11px] text-slate-400">
                {safeCommentsList.length}{" "}
                {safeCommentsList.length === 1 ? "comment" : "comments"}
              </p>
            </div>
          </div>

          {/* Scrollable Container */}
          <div className="max-h-125 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent">
            {safeCommentsList.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-xl bg-white/2 border border-white/5 hover:border-blue-500/30 hover:bg-white/4 transition-all duration-200 space-y-2.5"
              >
                <div className="flex items-center gap-3">
                  <Link
                    href={`/authors/profile/${comment.author?.id}`}
                    className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 overflow-hidden relative shrink-0 hover:ring-2 hover:ring-blue-500/50 transition"
                  >
                    {comment.author?.image ? (
                      <Image
                        src={comment.author.image}
                        alt={comment.author.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-400 text-xs font-bold bg-blue-500/10">
                        {comment.author?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-col">
                    <Link
                      href={`/authors/profile/${comment.author?.id}`}
                      className="text-sm font-medium text-slate-100 hover:text-blue-400 transition-colors leading-tight"
                    >
                      {comment.author?.name || "Anonymous"}
                    </Link>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pl-12">
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
