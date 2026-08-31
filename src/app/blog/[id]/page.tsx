"use client";

import AuthModal, { AuthActionType } from "@/components/modals/AuthModal";
import CommentSection from "@/components/blog/view/CommentSection";
import InteractionBar from "@/components/blog/view/InteractionBar";
import RelatedBlogs from "@/components/blog/view/RelatedBlogs";
import AuthorBio from "@/components/blog/view/AuthorBio";
import { AnimatePresence, motion } from "framer-motion";
import { UserCheck, UserPlus } from "lucide-react";
import { formatTimeAgo } from "@/utils/formatTime";
import { use, useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSession } from "next-auth/react";
import CTA from "@/components/home/CTA";
import { Post } from "@/types/post";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, status } = useSession();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const [commentCount, setCommentCount] = useState<number>(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [likeCount, setLikeCount] = useState(0);

  const [authAction, setAuthAction] = useState<AuthActionType>("generic");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const triggerAuthRequired = (action: AuthActionType) => {
    setAuthAction(action);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get?id=${id}`);
        const data = await res.json();
        console.log(data);

        if (data.success && data.post) {
          setPost(data.post);
          setLikeCount(data.post._count?.likes ?? 0);
          setCommentCount(data.post._count?.comments ?? 0);
          setCategoryId(data.post?.category?.id);

          if (typeof data.isLiked === "boolean") {
            setIsLiked(data.isLiked);
          }

          if (typeof data.isSaved === "boolean") {
            setIsSaved(data.isSaved);
          }

          if (typeof data.isFollowing === "boolean") {
            setIsFollowing(data.isFollowing);
          }
        } else {
          setError(data.error || "Blog post not found.");
        }
      } catch (err: any) {
        console.error("Fetch Blog Error:", err);
        setError("Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    async function incrementView() {
      const viewedKey = `viewed_post_${id}`;
      const hasVieweded = sessionStorage.getItem(viewedKey);

      if (!hasVieweded) {
        try {
          const res = await fetch("/api/post/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: id }),
          });

          const data = await res.json();

          if (data.success) {
            sessionStorage.setItem(viewedKey, "true");
            setPost((prev) => (prev ? { ...prev, views: data.views } : prev));
          }
        } catch (err) {
          console.error("View count update failed:", err);
        }
      }
    }

    incrementView();
  }, [id]);

  const handleFollowClick = async () => {
    if (status === "unauthenticated") {
      triggerAuthRequired("follow");
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
      } catch (err: any) {
        console.error("Follow action failed", err);
      } finally {
        setFollowLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#comments-section"
    ) {
      const timer = setTimeout(() => {
        const element = document.getElementById("comments-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleCommentAdded = () => {
    setCommentCount((prev) => prev + 1);
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
                <Link
                  href={`/authors/profile/${post.author?.id}`}
                  className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-white/10 relative shrink-0"
                >
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
                </Link>

                <div className="flex-1">
                  <Link
                    href={`/authors/profile/${post.author?.id}`}
                    className="font-semibold text-white capitalize text-sm sm:text-base hover:text-blue-400 transition"
                  >
                    {post.author?.name || "Anonymous Author"}
                  </Link>
                  <p className="text-xs text-slate-400">
                    {formatTimeAgo(post.createdAt)} • {post.readingTime || 5}{" "}
                    min read
                    {(post.views ?? 0) > 0 && ` • ${post.views} views`}
                  </p>
                </div>
                <div>
                  {!isOwnPost && (
                    <button
                      onClick={handleFollowClick}
                      disabled={followLoading}
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                        followLoading ? "opacity-70" : ""
                      } ${
                        isFollowing
                          ? "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                          : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                      }`}
                    >
                      {followLoading ? (
                        "Loading..."
                      ) : isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Follow
                        </>
                      )}
                    </button>
                  )}
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

            {/* Article Body */}
            <article
              id="article-content"
              className="prose prose-invert prose-blue max-w-none leading-relaxed text-slate-300
              [&_h1]:text-white [&_h1]:font-bold [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:mt-8 [&_h1]:mb-4
              [&_h2]:text-white [&_h2]:font-bold [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
              [&_h3]:text-white [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:mb-5 [&_p]:leading-7 [&_p]:text-slate-300/90
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6
              [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-950/20 [&_blockquote]:py-2 [&_blockquote]:px-5 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-slate-200 [&_blockquote]:my-6
              [&_pre]:bg-[#030712] [&_pre]:p-4 [&_pre]:sm:p-5 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:shadow-lg
              [&_code]:font-mono [&_code]:text-xs [&_code]:sm:text-sm [&_code]:text-blue-300 [&_code]:leading-relaxed
              [&_p_code]:bg-[#131d33] [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:rounded [&_p_code]:text-blue-300 [&_p_code]:font-mono [&_p_code]:text-xs"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            <InteractionBar
              postId={post.id}
              postTitle={post.title}
              liked={isLiked}
              saved={isSaved}
              totalLikes={likeCount}
              commentCount={commentCount}
              status={status}
              onAuthRequired={triggerAuthRequired}
            />

            <AuthorBio
              author={post.author}
              isOwnPost={!!isOwnPost}
              isFollowing={isFollowing}
              followLoading={followLoading}
              onFollowToggle={handleFollowClick}
            />

            <CommentSection
              postId={post.id}
              status={status}
              onAuthRequired={triggerAuthRequired}
              onCommentAdded={handleCommentAdded}
            />
          </div>

          {/* Sidebar Navigation */}
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
                <a
                  href="#comments-section"
                  className="text-slate-400 hover:text-blue-400 transition py-1 border-l-2 border-transparent hover:border-blue-400 pl-3"
                >
                  Comments
                </a>
              </nav>
            </div>
          </div>
        </div>

        <RelatedBlogs categoryId={categoryId} postId={post.id} />
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionType={authAction}
        authorName={post.author?.name || "Author"}
      />

      {status === "unauthenticated" && <CTA />}

      <Footer />
    </div>
  );
}
