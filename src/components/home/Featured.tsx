"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Heart, Eye, MessageSquare } from "lucide-react";
import Spinner from "@/components/home/Spinner";
import { Post } from "@/types/post";
import { formatTimeAgo } from "@/utils/formatTime";
import { PostMenu } from "../blog/PostMenu";
import { useSession } from "next-auth/react";
import AuthModal, { AuthActionType } from "../modals/AuthModal";
import { toast } from "sonner";

export default function Featured() {
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [authAction, setAuthAction] = useState<AuthActionType>("generic");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const { status } = useSession();

  const triggerAuthRequired = (action: AuthActionType) => {
    setAuthAction(action);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const res = await fetch("/api/post/featured");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setPosts(data.posts || []);

            if (data.savedPostIds && Array.isArray(data.savedPostIds)) {
              setSavedPostIds(new Set(data.savedPostIds));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch featured posts", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  const rollbackSave = (postId: string, wasSaved: boolean) => {
    setSavedPostIds((prev) => {
      const updated = new Set(prev);
      if (wasSaved) {
        updated.add(postId);
      } else {
        updated.delete(postId);
      }
      return updated;
    });
  };

  const handleToggleSave = async (postId: string) => {
    if (status === "unauthenticated") {
      triggerAuthRequired("save");
      return;
    }

    if (!postId) return;

    const wasSaved = savedPostIds.has(postId);

    setSavedPostIds((prev) => {
      const updated = new Set(prev);
      if (wasSaved) {
        updated.delete(postId);
      } else {
        updated.add(postId);
      }
      return updated;
    });

    try {
      const res = await fetch("/api/post/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();

      if (data.success) {
        setSavedPostIds((prev) => {
          const updated = new Set(prev);
          if (data.isSaved) {
            updated.add(postId);
          } else {
            updated.delete(postId);
          }
          return updated;
        });
      }
      if (data.message) {
        toast.success(data.message);
      }
    } catch (error: any) {
      console.error("Failed to toggle Save:", error);
      rollbackSave(postId, wasSaved);
      toast.error("Something went wrong!");
    }
  };

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header with Active "View All Articles" Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Editorials
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Handpicked popular stories from top creators on Inkly.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-blue-500/20"
        >
          View All Articles
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-[#131c35]/40 rounded-2xl border border-white/5">
          <p className="text-slate-400 text-sm">
            No featured editorials found.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => {
            const categoryName =
              typeof post.category === "object"
                ? post.category?.name
                : post.category;

            return (
              <div
                key={post.id}
                className="bg-[#0b132b] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 shadow-xl group"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-[#131c35]">
                    <Image
                      src={post.coverImage || "/default-post.png"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#060e20]/80 backdrop-blur-md text-blue-400 text-[11px] font-bold uppercase rounded-lg border border-blue-500/20">
                        {categoryName || "Editorial"}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10 bg-[#0b1326]/60 backdrop-blur-md rounded-full">
                      <PostMenu
                        post={post}
                        savedPostIds={savedPostIds}
                        onToggleSave={handleToggleSave}
                      />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span>{formatTimeAgo(post.createdAt)}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                          {post._count?.likes || 0}
                        </span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                          {post._count?.comments || 0}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6">
                      {post.description || post.content}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition-all"
                  >
                    Read Article
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionType={authAction}
      />
    </section>
  );
}
