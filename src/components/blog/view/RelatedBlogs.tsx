"use client";

import Spinner from "@/components/home/Spinner";
import { Post } from "@/types/post";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatTimeAgo } from "@/utils/formatTime";
import { Eye, Heart, MessageSquare } from "lucide-react";

interface RelatedBlogsProps {
  postId: string;
  categoryId?: string | null;
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

const RelatedBlogs = ({ postId, categoryId }: RelatedBlogsProps) => {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [relPostLoading, setRelPostLoading] = useState(true);

  useEffect(() => {
    setRelPostLoading(true);
    const fetchRelatedPosts = async (categoryId: string, postId: string) => {
      try {
        const res = await fetch(
          `/api/post/related?categoryId=${categoryId}&currentPostId=${postId}`,
        );
        const data = await res.json();
        if (data.success) {
          setRelatedPosts(data.posts);
        }
      } catch (err) {
        console.error("Failed to fetch related posts:", err);
      } finally {
        setRelPostLoading(false);
      }
    };

    if (postId && categoryId) {
      fetchRelatedPosts(categoryId, postId);
    }
  }, [postId, categoryId]);
  return (
    <>
      <div className="mt-20 pt-12 border-t border-white/10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-headline tracking-tight">
              Related Blogs
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              More articles you might enjoy based on this topic
            </p>
          </div>
        </div>

        {relPostLoading ? (
          <div className="space-y-3">
            <Spinner />
          </div>
        ) : relatedPosts.length > 0 ? (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={fadeUpVariants}
                  className="bg-[#131b2e]/50 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-blue-500/40 hover:bg-[#131b2e]/90 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 group"
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="relative aspect-video w-full overflow-hidden bg-slate-900 block"
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
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-semibold">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1 bg-[#0b1326]/80 backdrop-blur-md text-blue-300 rounded-full text-[11px] font-semibold border border-white/10 tracking-wide uppercase">
                        {post.category?.name || "General"}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-1 justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{formatTimeAgo(post.createdAt)}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                            {post._count?.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                            {post._count?.comments || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {post.views || 0}
                          </span>
                        </div>
                      </div>

                      <Link href={`/blog/${post.id}`} className="block">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition duration-200 line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {post.description || ""}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
                      <span className="text-slate-400 font-medium">
                        By {post.author?.name || "Anonymous"}
                      </span>
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center gap-1.5 font-semibold text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition duration-200"
                      >
                        Read Story <span className="text-sm">→</span>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        ) : (
          <div className="text-center py-16 bg-[#131b2e]/30 border border-dashed border-white/10 rounded-2xl text-slate-400">
            <p className="text-sm font-medium">
              No related Blogs found at the moment.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default RelatedBlogs;
