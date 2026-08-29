"use client";

import { use, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  UserPlus,
  UserCheck,
  BookOpen,
  Users,
  ArrowUpRight,
  Heart,
  Eye,
  Edit3,
} from "lucide-react";
import Spinner from "@/components/home/Spinner";
import { useSession } from "next-auth/react";
import { formatTimeAgo } from "@/utils/formatTime";
import { Post } from "@/types/post";


interface AuthorProfile {
  id: string;
  name: string;
  username: string;
  image?: string | null;
  bio?: string | null;
  posts: Post[];
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [author, setAuthor] = useState<AuthorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { data: session, status } = useSession();
  const user_id = session?.user?.id;

  useEffect(() => {
    const fetchAuthor = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/authors/profile/${id}`);
        if (res.ok) {
          const data = await res.json();
          setAuthor(data.author);
          setIsFollowing(data.isFollowing);
          console.log(data);
        }
      } catch (error: any) {
        console.error("Failed to fetch author:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAuthor();
    }
  }, [id]);

  const handleFollowClick = async () => {
    if (status === "unauthenticated") {
      setIsAuthModalOpen(true);
      return;
    }

    if (status === "authenticated" && author?.id) {
      try {
        setFollowLoading(true);

        const res = await fetch("/api/follow-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorId: author.id }),
        });

        const data = await res.json();

        if (data.success) {
          setIsFollowing(data.isFollowing);

          setAuthor((prev) => {
            if (!prev) return prev;
            const currentFollowers = prev._count?.followers ?? 0;
            return {
              ...prev,
              _count: {
                ...prev._count,
                followers: data.isFollowing
                  ? currentFollowers + 1
                  : Math.max(0, currentFollowers - 1),
              },
            };
          });
        }
      } catch (error: any) {
        console.error("Follow action failed", error);
      } finally {
        setFollowLoading(false);
      }
    }
  };

  const filteredPosts = useMemo(() => {
    if (!author?.posts) return [];

    let posts = [...author.posts];

    if (activeFilter === "OLDER") {
      return [...posts].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
    }

    if (activeFilter === "POPULAR") {
      return posts.sort((a, b) => {
        const likesA = a._count?.likes || 0;
        const likesB = b._count?.likes || 0;
        if (likesB !== likesA) return likesB - likesA;
        return (b.views || 0) - (a.views || 0);
      });
    }

    return posts;
  }, [author?.posts, activeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1326] flex items-center justify-center">
        <div className="text-xl font-bold text-white font-manrope flex justify-center items-center gap-4">
          <Spinner />
          <span>Inkly</span>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-[#060e20] text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-32 text-center">
          <h2 className="text-2xl font-bold mb-2">Author Not Found</h2>
          <p className="text-slate-400 mb-6">
            The author you are looking for does not exist.
          </p>
          <Link
            href="/authors"
            className="px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-500"
          >
            Back to Authors
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isLoggedInUserProfile = id === user_id;

  return (
    <div className="min-h-screen bg-[#060e20] text-[#dae2fd] flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 sm:pt-36 pb-24">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0b132b]/80 border border-white/10 p-6 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12"
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative shrink-0"
            >
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-indigo-500 blur-xl opacity-30 rounded-full" />
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-blue-500/30 shadow-lg">
                <Image
                  src={author.image || "/images/userImage.webp"}
                  alt={author.name || "pfp"}
                  fill
                  sizes="(max-width: 768px) 144px, 176px"
                  priority
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {author.name}
                  </h1>
                  <p className="text-blue-400 font-medium text-sm sm:text-base mt-1">
                    @{author.username}
                  </p>
                </div>
                {!isLoggedInUserProfile ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={followLoading}
                    onClick={handleFollowClick}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                      followLoading ? "opacity-70" : ""
                    } ${
                      isFollowing
                        ? "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                    }`}
                  >
                    {isFollowing ? (
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
                  </motion.button>
                ) : (
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Link
                      href="/user/profile"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/30 rounded-xl font-bold text-sm transition-all duration-200 shadow-md backdrop-blur-md group"
                    >
                      <Edit3 className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform duration-200" />
                      Edit Profile
                    </Link>
                  </motion.div>
                )}
              </div>
              {author.bio && (
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-8">
                  {author.bio}
                </p>
              )}

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-md mx-auto md:mx-0 bg-[#131c35]/60 p-4 rounded-2xl border border-white/5 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {author._count?.posts || 0}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Posts
                  </div>
                </div>
                <div className="border-x border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {author._count?.followers || 0}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Followers
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {author._count?.following || 0}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Following
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* POSTS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header & Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4 border-b border-white/10 pb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Articles by {author.name}
            </h2>

            {/* Filter Tabs */}
            <div className="flex bg-[#131c35] p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto overflow-x-auto scrollbar-none">
              {["ALL", "POPULAR", "OLDER"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 sm:flex-none px-5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                    activeFilter === filter
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {!filteredPosts || filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-[#0b132b]/40 rounded-2xl border border-white/5">
              <p className="text-slate-400 text-base">
                This author hasn't published any articles yet.
              </p>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredPosts.map((post) => {
                const categoryName =
                  typeof post.category === "object"
                    ? post.category?.name
                    : post.category;

                return (
                  <motion.div
                    key={post.id}
                    variants={item}
                    whileHover={{ y: -6 }}
                    className="bg-[#0b132b] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 shadow-xl group"
                  >
                    <div>
                      {/* Card Thumbnail */}
                      <div className="relative h-52 w-full overflow-hidden bg-[#131c35]">
                        <Image
                          src={post.coverImage || "/default-post.png"}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-[#060e20]/80 backdrop-blur-md text-blue-400 text-[11px] font-bold uppercase rounded-lg border border-blue-500/20">
                            {categoryName || "General"}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        {/* Date & Stats Row (Likes & Views) */}
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                          <span>{formatTimeAgo(post.createdAt)}</span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                              {post._count?.likes || 0}
                            </span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <Eye className="w-3.5 h-3.5 text-blue-400" />
                              {post.views || 0}
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
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
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
                  {author?.name}
                </span>{" "}
                and get notified when they publish new Blogs.
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

      <Footer />
    </div>
  );
}
