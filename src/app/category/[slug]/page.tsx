"use client";

import Footer from "@/components/layout/guest/Footer";
import Navbar from "@/components/layout/guest/Navbar";
import { motion } from "framer-motion";

const posts = [
  {
    title: "The Obsidian Protocol",
    tag: "Protocol",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCrztxV7V8wzxhzSbHRV1xo5MpYycp4pObvEulORXR4wNc6YK_YZZX3vy_YJWb6dWEw137jYhrArnQmd-5tkjho4uaboidYNeYQoHGbSIf2JU7OxUa8zG-xVJYB6JVQJe-yEPL3XFUOUWSk7gTx9BzyliRgRglpRcpTp032A8-y23ltkLYk243hZazohc8C5a0aVfXGQdR5wMjWwMFTeLOXWT_QFJTawgH6LqvwUYsYruuNIDaNiZ1vFnL74Fo5COjjA0x8HqHXsuqG",
    desc: "Redefining decentralized storage through cryptographic elegance.",
  },
  {
    title: "Future of Asynchronous Design",
    tag: "Design",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADErS1JTXohFM3aSOhmW4SPVDPElExADzjwfYdVCmbfSIDPTxtuLN7ghLFqiVZ3_Um_f-8t1sffClUuL_9myda2LnoF-P17UdOrYKuVgfyH--Kw1crpCUODpPO0soyuQpYxCXj0FNBWS-z4B096fK44R74xjv2t3QcNpDJvjMWCZMIlQTpW8ApfvaI4pxdNe3_1454tuHjzO6WQG6dT682BVpk-G-qAmlj_rARzJWHzYZktV0oUacvqlIcEZtbMyc7zVD1jPfMnYOz",
    desc: "Designing interfaces that respect human cognitive rhythm.",
  },
  {
    title: "Edge Computing",
    tag: "Infrastructure",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADErS1JTXohFM3aSOhmW4SPVDPElExADzjwfYdVCmbfSIDPTxtuLN7ghLFqiVZ3_Um_f-8t1sffClUuL_9myda2LnoF-P17UdOrYKuVgfyH--Kw1crpCUODpPO0soyuQpYxCXj0FNBWS-z4B096fK44R74xjv2t3QcNpDJvjMWCZMIlQTpW8ApfvaI4pxdNe3_1454tuHjzO6WQG6dT682BVpk-G-qAmlj_rARzJWHzYZktV0oUacvqlIcEZtbMyc7zVD1jPfMnYOz",
    desc: "Distributing intelligence to the edge of networks.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const CategoryPage = () => {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-8 mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 font-headline">
            Technology
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl">
            Explore articles in this category. Deep dives into modern tech.
          </p>
        </motion.header>

        {/* Tabs */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-7xl mx-auto px-8 mb-16"
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {["All", "Tech", "AI", "Startup", "Future"].map((tab, i) => (
              <button
                key={tab}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  tab === "Tech"
                    ? "bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Grid */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post, i) => (
              <motion.div key={i} variants={item}>
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
};

function PostCard({ post }: any) {
  return (
    <motion.article whileHover={{ y: -8 }} className="flex flex-col group">
      <div className="aspect-video mb-6 overflow-hidden rounded-lg bg-surface-container-low">
        <motion.img
          src={post.image}
          alt={post.title}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col grow bg-surface-container p-8 rounded-lg">
        <div className="mb-4">
          <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest rounded-full">
            {post.tag}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
          {post.title}
        </h3>

        <p className="text-on-surface-variant mb-8 line-clamp-3">{post.desc}</p>

        <div className="mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
          >
            Read More
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default CategoryPage;
