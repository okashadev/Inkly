"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTA from "@/components/home/CTA";
import Spinner from "@/components/home/Spinner";
import { useEffect, useState } from "react";
import { Heart, Eye, MessageSquare, Loader2 } from "lucide-react";

interface PostAuthor {
  id: string;
  name: string | null;
  image: string | null;
  username: string | null;
}

interface PostCount {
  likes: number;
  comments: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  description?: string;
  views?: number;
  category?: {
    name: string;
  };
  coverImage?: string | null;
  createdAt: string;
  author: PostAuthor;
  _count: PostCount;
}

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
  const { status } = useSession();
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchInitialFeed = async () => {
      try {
        const res = await fetch("/api/post/feed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ excludeIds: [], limit: 6 }),
        });
        const data = await res.json();

        if (data.success) {
          setFeaturedPost(data.featuredPost || null);
          setPosts(data.posts || []);
          // if (
          //   data.hasMore === false ||
          //   (data.posts && data.posts.length === 0)
          // ) {
          //   setHasMore(false);
          // }
        }
      } catch (err) {
        console.error("Failed to fetch feed posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialFeed();
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const currentIds = posts.map((p) => p.id);
    if (featuredPost?.id) {
      currentIds.push(featuredPost.id);
    }

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
        }

        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((p) => p.id));
          const uniqueNewPosts = fetchedPosts.filter(
            (p) => !existingIds.has(p.id),
          );
          return [...prevPosts, ...uniqueNewPosts];
        });
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more posts:", err);
    } finally {
      setLoadingMore(false);
    }
  };

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
        {/* Header Section */}
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

        {/* Featured Article Hero Card */}
        {featuredPost && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16"
          >
            <Link href={`/blog/${featuredPost.id}`} className="group block">
              <div className="bg-[#131b2e]/80 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/40 transition duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-2xl backdrop-blur-sm">
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-slate-900 flex items-center justify-center">
                  {featuredPost.coverImage ? (
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover group-hover:scale-105 transition duration-700 ease-out"
                    />
                  ) : (
                    <span className="text-slate-600 text-sm">
                      No Cover Image
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326]/60 via-transparent to-transparent lg:hidden" />
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold tracking-wide uppercase border border-blue-500/30">
                        {featuredPost.category?.name || "Featured"}
                      </span>
                      <span className="text-xs text-slate-400">
                        Top Liked Story 🔥
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-blue-400 transition duration-200 leading-snug">
                      {featuredPost.title}
                    </h2>

                    <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {featuredPost.description || featuredPost.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full relative overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 font-bold uppercase">
                        {featuredPost.author?.image ? (
                          <Image
                            src={featuredPost.author.image}
                            alt={featuredPost.author.name || "Author"}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        ) : (
                          (featuredPost.author?.name || "A")[0]
                        )}
                      </div>
                      <span className="font-medium text-slate-200">
                        {featuredPost.author?.name ||
                          featuredPost.author?.username ||
                          "Anonymous"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>
                        {new Date(featuredPost.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                        {featuredPost._count.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                        {featuredPost._count.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {featuredPost.views || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.section>
        )}

        {posts.length > 0 ? (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={fadeUpVariants}
                  className="bg-[#131b2e]/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-blue-500/30 hover:bg-[#131b2e] transition duration-300 shadow-xl group"
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="relative aspect-video w-full overflow-hidden bg-slate-900 flex items-center justify-center"
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
                      <span className="text-slate-600 text-xs">No Image</span>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#0b1326]/80 backdrop-blur-md text-blue-300 rounded-full text-xs font-medium border border-white/10">
                        {post.category?.name || "General"}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-1 justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                            {post._count.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                            {post._count.comments}
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

            {/* Load More Action Button */}
            {hasMore && (
              <motion.div
                variants={fadeUpVariants}
                className="flex justify-center pt-8"
              >
                <button
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
              </motion.div>
            )}
          </motion.section>
        ) : (
          <div className="text-center py-20 text-slate-400">
            No posts found in the feed.
          </div>
        )}
      </main>

      {status === "unauthenticated" && <CTA />}

      <Footer />
    </div>
  );
}
