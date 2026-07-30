"use client";

import { use, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/guest/Navbar";
import Footer from "@/components/layout/guest/Footer";
import { useSession } from "next-auth/react";
import CTA from "@/components/home/CTA";

interface PostData {
  id: string;
  title: string;
  description: string | null;
  content: string;
  coverImage: string | null;
  readingTime: number;
  createdAt: string;
  views: number;
  category?: {
    name: string;
  };
  author?: {
    id: string;
    name: string;
    image: string | null;
    bio?: string;
    _count?: {
      followers: number;
      posts: number;
    };
  };
}

export default function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, status } = useSession();

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get?id=${id}`);
        const data = await res.json();

        console.log("Fetched Post Data:", data);

        if (data.success && data.post) {
          setPost(data.post);

         if (typeof data.isFollowing === "boolean") {
            setIsFollowing(data.isFollowing);
          }
        } else {
          setError(data.error || "Blog post not found.");
        }
      } catch (err) {
        console.error("Fetch Blog Error:", err);
        setError("Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id, session?.user?.id]);

  const handleFollowClick = async () => {
    if (status === "unauthenticated") {
      setIsAuthModalOpen(true);
      return;
    }

    if (status === "authenticated" && post?.author?.id) {
      try {
        setFollowLoading(true);
        const res = await fetch("/api/follow-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorId: post.author.id }),
        });
        const data = await res.json();

        if (data.success) {
          setIsFollowing(data.isFollowing);

          setPost((prevPost) => {
            if (!prevPost || !prevPost.author) return prevPost;
            const currentCount = prevPost.author._count?.followers ?? 0;
            return {
              ...prevPost,
              author: {
                ...prevPost.author,
                _count: {
                  ...prevPost.author._count,
                  followers: data.isFollowing
                    ? currentCount + 1
                    : Math.max(0, currentCount - 1),
                  posts: prevPost.author._count?.posts ?? 0,
                },
              },
            };
          });
        }
      } catch (err) {
        console.error("Follow action failed", err);
      } finally {
        setFollowLoading(false);
      }
    }
  };

  const isOwnPost =
    session?.user?.id && post?.author?.id && session.user.id === post.author.id;

  if (loading) {
    return (
      <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="pt-36 pb-20 px-4 md:px-8 max-w-4xl mx-auto w-full animate-pulse space-y-8">
          <div className="h-8 bg-slate-800/60 rounded-lg w-1/4"></div>
          <div className="h-14 bg-slate-800/60 rounded-xl w-full md:w-3/4"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800/60"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-800/60 rounded w-32"></div>
              <div className="h-3 bg-slate-800/60 rounded w-24"></div>
            </div>
          </div>
          <div className="w-full h-80 md:h-112.5 bg-slate-800/60 rounded-2xl"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error || !post) {
    return (
      <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="pt-36 pb-20 px-4 text-center max-w-xl mx-auto space-y-6">
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-medium">
            {error || "Blog post unavailable."}
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition duration-200"
          >
            ← Return to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen font-body selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />

      <main className="pt-32 md:pt-36 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          {/* Main Content Column */}
          <div className="lg:col-span-8 xl:col-span-9 max-w-3xl mx-auto w-full">
            {/* Header Section */}
            <motion.header
              id="article-header"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              {post.category?.name && (
                <span className="inline-flex px-3.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold tracking-wider uppercase mb-5">
                  {post.category.name}
                </span>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6 font-headline tracking-tight text-white">
                {post.title}
              </h1>

              {post.description && (
                <p className="text-base sm:text-lg text-slate-300/90 mb-8 leading-relaxed font-normal">
                  {post.description}
                </p>
              )}

              {/* Author Info Bar */}
              <div className="flex items-center gap-4 py-4 border-y border-white/10">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-white/10 relative shrink-0">
                  {post.author?.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name || "Author"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold">
                      {post.author?.name?.[0]?.toUpperCase() || "A"}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-white capitalize text-sm sm:text-base">
                    {post.author?.name || "Anonymous Author"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    • {post.readingTime || 5} min read
                    {post.views > 0 && ` • ${post.views} views`}
                  </p>
                </div>
              </div>
            </motion.header>

            {/* Feature Cover Image */}
            {post.coverImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl relative"
              >
                <div className="relative aspect-video md:aspect-21/9 w-full">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </motion.div>
            )}

            {/* Article Body (HTML / BlockNote Output) */}
            <article
              id="article-content"
              className="prose prose-invert prose-blue max-w-none leading-relaxed text-slate-300
                [&_h1]:text-white [&_h1]:font-bold [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:text-white [&_h2]:font-bold [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:text-white [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:mb-5 [&_p]:leading-7 [&_p]:text-slate-300/90
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6
                [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-950/20 [&_blockquote]:py-2 [&_blockquote]:px-5 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-slate-200 [&_blockquote]:my-6
                
                /* Code Block Styling */
                [&_pre]:bg-[#030712] [&_pre]:p-4 [&_pre]:sm:p-5 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:shadow-lg
                [&_code]:font-mono [&_code]:text-xs [&_code]:sm:text-sm [&_code]:text-blue-300 [&_code]:leading-relaxed
                [&_p_code]:bg-[#131d33] [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:rounded [&_p_code]:text-blue-300 [&_p_code]:font-mono [&_p_code]:text-xs"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author Bio Section */}
            <div
              id="author-bio"
              className="mt-16 p-6 sm:p-8 bg-[#131b2e]/80 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl backdrop-blur-sm"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-800 border border-white/10 relative shrink-0">
                {post.author?.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || "Author"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold text-2xl">
                    {post.author?.name?.[0]?.toUpperCase() || "A"}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-3 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl capitalize font-bold text-white">
                      {post.author?.name || "Author"}
                    </h3>
                  </div>
                  {!isOwnPost && (
                    <button
                      onClick={handleFollowClick}
                      disabled={followLoading}
                      className={`w-full sm:w-auto px-5 py-2 text-xs font-semibold rounded-xl transition duration-200 active:scale-95 ${
                        isFollowing
                          ? "bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700"
                          : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                      }`}
                    >
                      {followLoading
                        ? "Loading..."
                        : isFollowing
                          ? "Following"
                          : "Follow"}
                    </button>
                  )}
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {post.author?.bio ||
                    "Writer and contributor at Inkly. Passionate about sharing ideas and insights."}
                </p>

                {/* Followers & Articles Stats */}
                <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 border-t border-white/10 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">
                      {post?.author?._count?.followers || 0}
                    </span>
                    <span className="text-slate-400">Followers</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">
                      {post?.author?._count?.posts || 0}
                    </span>
                    <span className="text-slate-400">Articles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Contents - Desktop Sidebar (Sticky) */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="sticky top-32 p-5 rounded-2xl bg-[#131b2e]/60 border border-white/10 backdrop-blur-md space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                On This Page
              </h4>
              <nav className="flex flex-col gap-2 text-xs">
                <a
                  href="#article-header"
                  className="text-slate-400 hover:text-blue-400 transition py-1 border-l-2 border-transparent hover:border-blue-400 pl-3"
                >
                  Top of Article
                </a>
                <a
                  href="#article-content"
                  className="text-slate-400 hover:text-blue-400 transition py-1 border-l-2 border-transparent hover:border-blue-400 pl-3"
                >
                  Content
                </a>
                <a
                  href="#author-bio"
                  className="text-slate-400 hover:text-blue-400 transition py-1 border-l-2 border-transparent hover:border-blue-400 pl-3"
                >
                  About Author
                </a>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#131b2e] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center"
            >
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>

              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                👤
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Join Inkly to Follow
              </h3>

              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                You need an account to follow{" "}
                <span className="text-slate-200 font-semibold">
                  {post.author?.name}
                </span>{" "}
                and get notified when they publish new stories.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition duration-200"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl font-semibold text-sm transition duration-200"
                >
                  Create Account
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {status === "unauthenticated" && <CTA />}

      <Footer />
    </div>
  );
}
