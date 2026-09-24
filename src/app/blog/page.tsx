"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTA from "@/components/home/CTA";
import Spinner from "@/components/home/Spinner";
import { useEffect, useState, useRef, useCallback } from "react";
import { Heart, Eye, MessageSquare, Loader2 } from "lucide-react";
import { Post } from "@/types/post";
import { formatTimeAgo } from "@/utils/formatTime";
import { PostMenu } from "@/components/blog/PostMenu";
import AuthModal, { AuthActionType } from "@/components/modals/AuthModal";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const },
  },
};

export default function BlogsPage() {
  const [authAction, setAuthAction] = useState<AuthActionType>("generic");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const { status } = useSession();

  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());

  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  const triggerAuthRequired = (action: AuthActionType) => {
    setAuthAction(action);
    setIsAuthModalOpen(true);
  };

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
        if (data.message) {
          toast.success(data.message);
        }
      } else {
        rollbackSave(postId, wasSaved);
        toast.error(data.error || "Failed to update save status.");
      }
    } catch (error: unknown) {
      console.error("Failed to toggle Save:", error);
      rollbackSave(postId, wasSaved);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchInitialFeed = async () => {
      try {
        const res = await fetch("/api/post/feed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ excludeIds: [], limit: 6 }),
          signal: controller.signal,
        });
        const data = await res.json();

        if (data.success) {
          const fetchedPosts: Post[] = data.posts || [];
          setPosts(fetchedPosts);
          setHasMore(Boolean(data.hasMore));

          const initialSavedIds = new Set<string>();
          fetchedPosts.forEach((p: Post & { isSaved?: boolean }) => {
            if (p.isSaved) {
              initialSavedIds.add(p.id);
            }
          });
          setSavedPostIds(initialSavedIds);
        }
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to fetch feed posts:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialFeed();

    return () => {
      controller.abort();
    };
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;
    setLoadingMore(true);

    const currentIds = posts.map((p) => p.id);

    try {
      const res = await fetch("/api/post/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excludeIds: currentIds, limit: 6 }),
      });
      const data = await res.json();

      if (data.success) {
        const fetchedPosts: Post[] = data.posts || [];

        if (fetchedPosts.length === 0 || data.hasMore === false) {
          setHasMore(false);
        } else {
          setHasMore(Boolean(data.hasMore));
        }

        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((p) => p.id));
          const uniqueNewPosts = fetchedPosts.filter((p) => !existingIds.has(p.id));
          return [...prevPosts, ...uniqueNewPosts];
        });

        setSavedPostIds((prev) => {
          const updated = new Set(prev);
          fetchedPosts.forEach((p: Post & { isSaved?: boolean }) => {
            if (p.isSaved) {
              updated.add(p.id);
            }
          });
          return updated;
        });
      } else {
        setHasMore(false);
      }
    } catch (err: unknown) {
      console.error("Failed to load more posts:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [posts, loadingMore, hasMore, loading]);

  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          handleLoadMore();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [handleLoadMore, hasMore, loading, loadingMore]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0b1326] flex items-center justify-center">
        <div className="text-xl font-bold text-white font-manrope flex justify-center items-center gap-4">
          <Spinner />
          <span>Inkly</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen flex flex-col justify-between selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />

      <main className="pt-32 md:pt-36 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full">
        <motion.header
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mb-14 text-center max-w-3xl mx-auto space-y-4"
        >
          <motion.h1
            variants={fadeUpVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight font-headline"
          >
            Explore Perspectives & Engineering Insights
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="text-slate-400 text-base sm:text-lg leading-relaxed"
          >
            Discover deep dives into full-stack architecture, UI design, and
            modern developer workflows crafted by creators worldwide.
          </motion.p>
        </motion.header>

        {posts.length > 0 ? (
          <section className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
                  className="bg-[#131b2e]/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-blue-500/30 hover:bg-[#131b2e] transition duration-300 shadow-xl group relative"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    <Link
                      href={`/blog/${post.id}`}
                      className="absolute inset-0 z-0"
                    >
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-slate-600 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                      <span className="px-3 py-1 bg-[#0b1326]/80 backdrop-blur-md text-blue-300 rounded-full text-xs font-medium border border-white/10">
                        {post.category?.name || "General"}
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

                  <div className="p-6 flex flex-col flex-1 justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{formatTimeAgo(post.createdAt)}</span>
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                            {post._count?.likes ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                            {post._count?.comments ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {post.views || 0}
                          </span>
                        </div>
                      </div>

                      <Link href={`/blog/${post.id}`} className="block">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition duration-200 line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                        {post.description || post.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-400">
                        By{" "}
                        {post.author?.name ||
                          post.author?.username ||
                          "Anonymous"}
                      </span>
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition duration-200"
                      >
                        Read Story →
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <div ref={observerTargetRef} className="h-4 w-full" />

            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-[#131b2e] hover:bg-slate-800 text-slate-200 border border-white/10 rounded-full text-xs font-semibold uppercase tracking-wider transition duration-200 active:scale-95 shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      Loading...
                    </>
                  ) : (
                    "Load More Articles"
                  )}
                </button>
              </div>
            )}
          </section>
        ) : (
          <div className="text-center py-20 text-slate-400">
            No posts found in the feed.
          </div>
        )}
      </main>

      {status === "unauthenticated" && <CTA />}

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionType={authAction}
      />
    </div>
  );
}