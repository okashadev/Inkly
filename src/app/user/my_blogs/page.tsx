"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function MyBlogs() {
  return (
    <div className="min-h-screen bg-background text-foreground">
        <AppSidebar />
        <TopNav />
    <main className="md:ml-64 pt-24 px-8 pb-12 min-h-screen bg-[#0F172A] text-white">
      
      {/* Hero Header */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12"
      >
        <motion.div variants={item} className="space-y-2">
          <h2 className="text-5xl font-black tracking-tight">
            My Blogs
          </h2>
          <p className="text-[#CBD5F5] text-lg">
            Manage your stories and drafts from a single workspace.
          </p>
        </motion.div>

        <motion.button
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-linear-to-br from-[#3B82F6] to-[#1E40AF] text-white font-bold text-sm uppercase tracking-wide rounded-xl shadow-xl flex items-center gap-2"
        >
          <span className="material-symbols-outlined">edit_square</span>
          Write New
        </motion.button>
      </motion.section>

      {/* Stats */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        {[
          {
            title: "Total Blogs",
            value: "42",
            sub: "+3 this month",
          },
          {
            title: "Total Views",
            value: "12.5k",
            sub: "↑ 12%",
          },
          {
            title: "Drafts Count",
            value: "8",
            sub: "Ready to publish",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ y: -6 }}
            className="p-8 bg-[#1E293B] rounded-xl border-l-4 border-blue-500/30 transition-all"
          >
            <div className="flex justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-[#CBD5F5]">
                {card.title}
              </span>
              <span className="material-symbols-outlined text-blue-400">
                article
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{card.value}</span>
              <span className="text-blue-400 text-xs">{card.sub}</span>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Filters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 flex flex-col md:flex-row gap-6 items-center"
      >
        <div className="w-full flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-symbols-outlined">search</span>
          </span>

          <input
            className="w-full bg-[#1E293B] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
            placeholder="Search by title, tags or content..."
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-[#1E293B] rounded-xl p-1.5 border border-white/5">
          {["All", "Drafts", "Published"].map((tab, i) => (
            <button
              key={i}
              className={`px-6 py-2 rounded-xl text-sm ${
                i === 0
                  ? "bg-blue-500 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort */}
        <button className="flex items-center gap-2 bg-[#1E293B] px-6 py-4 rounded-xl border border-white/5">
          <span className="text-sm">Newest First</span>
          <span className="material-symbols-outlined text-sm">
            expand_more
          </span>
        </button>
      </motion.section>

      {/* Blog Grid */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {[1, 2, 3].map((_, i) => (
          <motion.article
            key={i}
            variants={item}
            whileHover={{ y: -10 }}
            className="group bg-[#1E293B] rounded-xl overflow-hidden transition-all"
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
              <motion.img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxILI6ZgSbKRQZnETXlyLwZKN9CwErIXwV22tF9zLzB5z42iB6VIb65CQ6oajIeWzo8O3QX3BTkNOdyBKvLwg9MzE9BxGEpafkQh1ZVaOUAAXHQC8mBlgvxa5RUTdIM5Bp92QxdRAIj32ff2ZUqh7HIY8LMT25WdJdW4tgY5VrEYWC6aUYVmndLsGaPTdx1TTiFi2QJvyToocMawy7lgFnfIIfzYtJRLSzKzyZnzdzUFB1aMs5vM06_BwIbkWFNNuKzF4CzDC3QZTg"
                alt="blog"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6 }}
              />

              {/* Badge */}
              <span className="absolute top-4 left-4 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs rounded-full">
                Published
              </span>

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                {["edit", "visibility", "delete"].map((icon, idx) => (
                  <button
                    key={idx}
                    className="w-12 h-12 rounded-full bg-[#0F172A] flex items-center justify-center hover:scale-110 transition"
                  >
                    <span className="material-symbols-outlined">
                      {icon}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                  #React
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition">
                Mastering React Server Components in 2024
              </h3>

              <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                Discover the architectural shifts that are redefining how we think about data fetching...
              </p>

              <div className="pt-4 border-t border-white/5 flex justify-between text-xs text-gray-400">
                <span>Oct 12 • 8 min</span>
                <span>1.2k views</span>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.section>
    </main>
    </div>
  );
}