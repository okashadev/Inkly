"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";

const posts = [
  {
    title: "Mastering React Server Components in 2024",
    tag: "Development",
    author: "Alex Rivera",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBMK-WiFNUCkXbFX9loBOuaEifYFKAr2MA_D9Emg8volfkDMX-uD7W6coKjVPRRsZqnSU_SN_7Hf_zF1So67gl80loEV-lXBJyPSTDYMPUCmJguxk7ChC2JhZvtzT2PcPQj1w4SaCXnhYfprAddfwVcIjiKGCgbmtTe83c1wfBhxbzvMVQkkU4F8qs7ENakJyNhgnlsYNF6u-FkIkrLyf_H4jBePXubQjSq8gl5zCY2Rtgl0xhwZ_-wY82qBKQSgh142azeZp89UPQ",
    desc: "Dive deep into React Server Components and streaming architecture.",
  },
  {
    title: "Optimization Patterns for Large React Apps",
    tag: "Performance",
    author: "Elena Chen",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDodCExVtiPHt9z1iz_f_6LjUpX9aw8J3QeQQz5gxJp6RZuKaNYLZ7m9QR4l9OZfZY0CYu-fHBudjd_r9tmY5qtRqmqB4SAbm_NfxG3MfQo6aQdHdrnu79Xt-9NzY4WmUvLiLsz0zXk7DkRbAsm6-WplGcGiTIEonwyN22MIFzhfU-EyRsXZDWoopb10INej-lcOwkosdcrbmyVljab8Kb4gMZ5PygTf2jkx-hzjBp6ixq1O8M0a9EtB8CQyoEnl8wQHFtfZ-3hPnxb",
    desc: "Handling state in enterprise-scale applications.",
  },
  {
    title: "The Future of React",
    tag: "Architecture",
    author: "Marcus Thorne",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDodCExVtiPHt9z1iz_f_6LjUpX9aw8J3QeQQz5gxJp6RZuKaNYLZ7m9QR4l9OZfZY0CYu-fHBudjd_r9tmY5qtRqmqB4SAbm_NfxG3MfQo6aQdHdrnu79Xt-9NzY4WmUvLiLsz0zXk7DkRbAsm6-WplGcGiTIEonwyN22MIFzhfU-EyRsXZDWoopb10INej-lcOwkosdcrbmyVljab8Kb4gMZ5PygTf2jkx-hzjBp6ixq1O8M0a9EtB8CQyoEnl8wQHFtfZ-3hPnxb",
    desc: "Beyond the virtual DOM.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-8 max-w-360 mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-on-surface">
            Search results for "React"
          </h1>
          <p className="text-lg text-on-surface-variant">
            Showing articles related to your query —{" "}
            <span className="text-primary">12 results found</span>
          </p>
        </motion.header>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="relative group">
            <input
              defaultValue="React"
              className="w-full bg-surface-container-low text-on-surface rounded-full py-5 px-6 focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="Search articles..."
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {["All", "Articles", "Tags", "Authors"].map((f, i) => (
            <button
              key={f}
              className={`px-8 py-2.5 rounded-full font-semibold transition ${
                i === 0
                  ? "bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-bright"
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {posts.map((post, i) => (
            <motion.div key={i} variants={item}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-24 flex justify-center gap-2"
        >
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className={`w-12 h-12 rounded-full font-bold ${
                p === 1
                  ? "bg-primary text-black"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {p}
            </button>
          ))}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}

function PostCard({ post }: any) {
  return (
    <motion.article
      whileHover={{ y: -10 }}
      className="group bg-surface-container rounded-lg overflow-hidden flex flex-col shadow-xl"
    >
      <div className="aspect-video overflow-hidden">
        <motion.img
          src={post.image}
          alt={post.title}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-8 flex flex-col grow">
        <span className="text-xs font-bold uppercase text-on-surface-variant mb-3">
          {post.tag}
        </span>

        <h3 className="text-2xl font-black text-on-surface mb-4 group-hover:text-primary transition">
          {post.title}
        </h3>

        <p className="text-on-surface-variant text-sm mb-8">{post.desc}</p>

        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs text-on-surface/60">{post.author}</span>

          <motion.button
            whileHover={{ x: 4 }}
            className="text-primary text-xs font-bold uppercase flex items-center gap-1"
          >
            Read More →
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
