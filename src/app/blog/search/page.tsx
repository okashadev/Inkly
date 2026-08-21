"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Spinner from "@/components/home/Spinner";

interface Post {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  category?: {
    name: string;
    slug: string;
  };
  author?: {
    name: string;
    image?: string;
  };
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setPosts([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setPosts(resData.data);
        }
      })
      .catch((err) => console.error("Error fetching search results:", err))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <main className="pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto min-h-[70vh]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-3"
      >
        <h1 className="text-3xl md:text-5xl font-black text-white font-manrope">
          {query ? (
            <>
              Search results for{" "}
              <span className="text-blue-400">"{query}"</span>
            </>
          ) : (
            "Search Articles"
          )}
        </h1>
        <p className="text-sm md:text-base text-slate-400">
          {loading
            ? "Searching database..."
            : query
              ? `${posts.length} ${posts.length === 1 ? "article" : "articles"} found`
              : "Type something in the navbar search bar to get started"}
        </p>
      </motion.header>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20 text-white gap-3">
          <Spinner />
          <span className="text-slate-400 text-sm">Fetching articles...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && query && posts.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl max-w-xl mx-auto">
          <p className="text-slate-300 text-lg font-semibold mb-2">
            No results found
          </p>
          <p className="text-slate-400 text-sm">
            We couldn't find any articles matching "{query}". Try searching for
            another topic or category.
          </p>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && posts.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={item}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-white gap-3">
            <Spinner /> Loading...
          </div>
        }
      >
        <SearchContent />
      </Suspense>
      <Footer />
    </>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.id}`}>
      <motion.article
        whileHover={{ y: -6 }}
        className="group bg-[#131B2E]/80 hover:bg-[#131B2E] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden flex flex-col h-full transition-all shadow-xl"
      >
        <div className="aspect-video relative overflow-hidden bg-white/5">
          <Image
            src={post.coverImage || "/images/placeholder.webp"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-6 flex flex-col grow">
          {post.category && (
            <span className="text-xs font-bold uppercase text-blue-400 tracking-wider mb-2">
              {post.category.name}
            </span>
          )}

          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
            {post.description}
          </p>

          <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {post.author?.image && (
                <Image
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
              )}
              <span className="text-xs text-slate-300 font-medium">
                {post.author?.name || "Inkly Author"}
              </span>
            </div>

            <span className="text-blue-400 text-xs font-bold uppercase group-hover:translate-x-1 transition-transform">
              Read →
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
