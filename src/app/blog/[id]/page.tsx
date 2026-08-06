"use client";

import { use, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/guest/Navbar";
import Footer from "@/components/layout/guest/Footer";
import { useSession } from "next-auth/react";
import CTA from "@/components/home/CTA";

interface CommentType {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image: string | null;
  };
}

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

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<CommentType[]>([
    {
      id: "1",
      content:
        "Great article! Really enjoyed reading through your perspective on this topic.",
      createdAt: new Date().toISOString(),
      author: {
        name: "Alex Johnson",
        image: null,
      },
    },
  ]);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get?id=${id}`);
        const data = await res.json();

        console.log("Fetched Post Data:", data);

        if (data.success && data.post) {
          setPost(data.post);
          setLikeCount(data.post._count?.likes ?? 0);

          if (typeof data.isLiked === "boolean") {
            setIsLiked(data.isLiked);
          }

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

  useEffect(() => {
    async function fetchComments() {
      if (!id) return;
      try {
        const res = await fetch(`/api/post/comment?postId=${id}`);
        const data = await res.json();
        if (data.success) {
          setComments(data.comments);
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
      }
    }

    fetchComments();
  }, [id]);

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

  const handleLikeClick = async () => {
    if (status === "unauthenticated") {
      setIsAuthModalOpen(true);
      return;
    }
    if (!post?.id) return;

    const previousIsLiked = isLiked;
    const previousCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const res = await fetch("/api/post/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });

      const data = await res.json();

      if (data.success) {
        setIsLiked(data.isLiked);
        setLikeCount(data.likesCount);
      } else {
        setIsLiked(previousIsLiked);
        setLikeCount(previousCount);
      }
    } catch (err: any) {
      console.error("Failed to toggle like:", err);
      setIsLiked(previousIsLiked);
      setLikeCount(previousCount);
    }
  };

  const handleSaveClick = () => {
    if (status === "unauthenticated") {
      setIsAuthModalOpen(true);
      return;
    }
    setIsSaved(!isSaved);
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        });
      } catch (e) {
        console.log("Error sharing", e);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleCommentSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (status === "unauthenticated") {
      setIsAuthModalOpen(true);
      return;
    }

    if (!commentInput.trim() || !post?.id) return;

    try {
      const res = await fetch("/api/post/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          content: commentInput,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setCommentInput("");
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
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

            <div className="my-10 py-4 px-6 bg-[#131b2e]/60 border border-white/10 rounded-2xl flex items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Like Button */}
                <button
                  onClick={handleLikeClick}
                  className={`flex items-center gap-2 text-sm font-semibold transition active:scale-95 ${
                    isLiked
                      ? "text-rose-500"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isLiked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>{likeCount}</span>
                </button>

                {/* Scroll to Comment Button */}
                <a
                  href="#comments-section"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  </svg>
                  <span>{comments.length}</span>
                </a>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                {/* Save / Bookmark Button */}
                <button
                  onClick={handleSaveClick}
                  className={`p-2 rounded-xl border border-white/5 transition active:scale-95 ${
                    isSaved
                      ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                      : "text-slate-400 hover:text-white bg-slate-800/40"
                  }`}
                  title="Bookmark"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isSaved ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShareClick}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/40 border border-white/5 rounded-xl transition active:scale-95"
                  title="Share"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
              </div>
            </div>

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
            <section id="comments-section" className="mt-16 space-y-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Comments ({comments.length})
              </h3>

              {/* Comment Input Box */}
              <form
                onSubmit={handleCommentSubmit}
                className="p-5 bg-[#131b2e]/80 border border-white/10 rounded-2xl space-y-4 shadow-xl"
              >
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={
                    status === "authenticated"
                      ? "What are your thoughts?"
                      : "Log in to join the conversation..."
                  }
                  rows={3}
                  className="w-full bg-[#0b1326] text-white border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 transition resize-none placeholder:text-slate-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition duration-200"
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              {/* Comment List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-6">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-5 bg-[#131b2e]/40 border border-white/5 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 border border-white/10 relative shrink-0">
                          {comment.author.image ? (
                            <Image
                              src={comment.author.image}
                              alt={comment.author.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold text-xs">
                              {comment.author.name[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {comment.author.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300/90 leading-relaxed pl-12">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
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
