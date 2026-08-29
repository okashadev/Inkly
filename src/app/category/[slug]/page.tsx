"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Spinner from "@/components/home/Spinner";
import { 
  HiHeart, 
  HiEye, 
  HiArrowRight, 
  HiFolder, 
  HiCalendar 
} from "react-icons/hi2";
import { Post } from "@/types/post";
import { formatTimeAgo } from "@/utils/formatTime";

interface PostAuthor {
  id: string;
  name: string | null;
  image: string | null;
  username: string | null;
}

interface PostCount {
  likes: number;
}

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   description?: string;
//   views?: number;
//   category?: {
//     name: string;
//     slug: string;
//   };
//   coverImage?: string | null;
//   createdAt: string;
//   author: PostAuthor;
//   _count: PostCount;
// }

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const } 
  },
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);

  const [posts, setPosts] = useState<Post[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      setLoading(true);
      setError(null);
      try {
       const res = await fetch(
          `/api/categories/get-post-by-cat?slug=${encodeURIComponent(slug)}`
        );
        const data = await res.json();
        console.log(data.message);

        if (data.success) {
          setPosts(data.blogs || []);

        } else {
          setPosts([]);
          setError(data.error || "Failed to load articles.");
        }
      } catch (err) {
        console.error("Fetch Category Error:", err);
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPostsByCategory();
    }
  }, [slug]);

  const categoryTitle = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "";

return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen flex flex-col justify-between selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />

      <main className="pt-32 md:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <HiFolder className="w-4 h-4" />
            <span>Category</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight font-headline">
            {categoryTitle}
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Explore deep dives, architectural guides, and articles published under {categoryTitle}.
          </p>
        </motion.header>

        {/* Dynamic Content State */}
        {loading ? (
          <div className="min-h-87.5 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
              <Spinner />
              <span>Fetching articles...</span>
            </div>
          </div>
        ) : error || posts?.length === 0 ? (
          <div className="min-h-75 flex flex-col items-center justify-center text-center p-8 bg-[#131b2e]/40 rounded-3xl border border-white/10 max-w-lg mx-auto">
            <HiFolder className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Articles Found</h3>
            <p className="text-slate-400 text-sm">{error || "There are no posts in this category yet."}</p>
          </div>
        ) : (
          /* Grid Section */
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts?.map((post) => (
              <motion.div key={post.id} variants={item}>
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="bg-[#131b2e]/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full hover:border-blue-500/30 hover:bg-[#131b2e] transition-all duration-300 shadow-xl group">
      {/* Cover Image */}
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
          <span className="text-slate-600 text-xs font-medium">No Image</span>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-[#0b1326]/80 backdrop-blur-md text-blue-300 rounded-full text-xs font-semibold border border-white/10 uppercase tracking-wider">
            {post.category?.name || "General"}
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1 justify-between space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <HiCalendar className="w-4 h-4 text-slate-500" />
              <span>
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-pink-400/90 font-medium">
                <HiHeart className="w-4 h-4" />
                {post._count?.likes ?? 0}
              </span>
              <span className="inline-flex items-center gap-1 text-blue-400/90 font-medium">
                <HiEye className="w-4 h-4" />
                {post.views ?? 0}
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full relative overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-xs uppercase">
              {post.author?.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              ) : (
                (post.author?.name || "A")[0]
              )}
            </div>
            <span className="text-xs text-slate-300 font-medium truncate max-w-27.5">
              {post.author?.name || post.author?.username || "Anonymous"}
            </span>
          </div>

          <Link
            href={`/blog/${post.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition duration-200 uppercase tracking-wider"
          >
            <span>Read Story</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}