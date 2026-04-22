"use client";

import Footer from "@/components/layout/guest/Footer";
import Navbar from "@/components/layout/guest/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";

const posts = [
  {
    title: "Mastering React Server Components",
    tag: "Development",
    desc: "Deep dive into server components and modern React architecture.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAO3JdOgRzKm4MlGcE7vzYwdzwLkDaSJXBpvK0_dOwvZQN7msmdZNgzctNhYGRvIaQe4zprgZqmKeXTFD0i-kv2_cxt6MUY0K0oRbmYLQ4f8iCjBE7W4qb-3sgc3IuIQ5W8LQQR13KQKx68n-cULfcyfGowRSrqQD44jSEluqnRjZW7aVV5y5x4Tp3kATiS7-fXOC3Yvx6OVb0-vtOo1jyfS96oHGZ5iRk04HrsGCCqsowIhO_rNSSpOPJIkZuIUuhdxmVaD3ZaanxM",
  },
  {
    title: "Asynchronous Design Future",
    tag: "Design",
    desc: "How UI transitions are becoming storytelling layers in modern apps.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAO3JdOgRzKm4MlGcE7vzYwdzwLkDaSJXBpvK0_dOwvZQN7msmdZNgzctNhYGRvIaQe4zprgZqmKeXTFD0i-kv2_cxt6MUY0K0oRbmYLQ4f8iCjBE7W4qb-3sgc3IuIQ5W8LQQR13KQKx68n-cULfcyfGowRSrqQD44jSEluqnRjZW7aVV5y5x4Tp3kATiS7-fXOC3Yvx6OVb0-vtOo1jyfS96oHGZ5iRk04HrsGCCqsowIhO_rNSSpOPJIkZuIUuhdxmVaD3ZaanxM",
  },
  {
    title: "Edge Computing Architecture",
    tag: "Architecture",
    desc: "Why the future is moving from cloud to edge-first systems.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAO3JdOgRzKm4MlGcE7vzYwdzwLkDaSJXBpvK0_dOwvZQN7msmdZNgzctNhYGRvIaQe4zprgZqmKeXTFD0i-kv2_cxt6MUY0K0oRbmYLQ4f8iCjBE7W4qb-3sgc3IuIQ5W8LQQR13KQKx68n-cULfcyfGowRSrqQD44jSEluqnRjZW7aVV5y5x4Tp3kATiS7-fXOC3Yvx6OVb0-vtOo1jyfS96oHGZ5iRk04HrsGCCqsowIhO_rNSSpOPJIkZuIUuhdxmVaD3ZaanxM",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorProfilePage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-12"
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-linear-to-r from-[#adc6ff] to-[#4d8eff] blur-xl opacity-30 rounded-full" />
              <div className="relative w-48 h-48 rounded-full overflow-hidden border border-[#424754]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIx-2aOfVUX89-iRJxM2DeC-aGy5J4Iu5tXTbj3xQfV5z0yWr5WTE2F5wxx-wzQMcXlQcvyDOY79hhHSN4UYjZd27k23s02r5dS96htBZZq-j0ny5PoP32BtxG9OuLwzVh4qA4ccli0rJ53IQo-abm-Ozk_P7Dm--xVqHOQZgAIrSYMVfvzc9lHaLT0n-9GhGvRqae6e_6noLpl8Zo4_ujTd-0G7_60CpNu62f4Y66mK4gic3nesWpbWABe32CrlpR641gIU__XFq2"
                  alt="author"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:flex-row justify-between gap-6 mb-6"
              >
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white">
                    Alex Rivera
                  </h1>
                  <p className="text-[#adc6ff]">@arivera</p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button className="bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black px-6 py-2 rounded-full font-bold text-xs">
                    Follow
                  </button>
                  <button className="border border-[#424754] text-[#c2c6d6] px-6 py-2 rounded-full text-xs">
                    Message
                  </button>
                </div>
              </motion.div>

              <p className="text-[#c2c6d6] max-w-2xl mb-8">
                Senior Software Architect & Design Enthusiast writing about UI
                systems, distributed architecture and modern frontend
                engineering.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-10 items-center">
                <div>
                  <div className="text-2xl font-bold text-white">42</div>
                  <div className="text-xs text-[#c2c6d6]">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">12.5k</div>
                  <div className="text-xs text-[#c2c6d6]">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">480</div>
                  <div className="text-xs text-[#c2c6d6]">Following</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* POSTS SECTION */}
        <section className="max-w-7xl mx-auto px-8">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col md:flex-row justify-between mb-12 gap-6"
          >
            <h2 className="text-3xl font-black text-white">
              Articles by Alex Rivera
            </h2>

            <div className="flex bg-[#171f33] p-1 rounded-full">
              {["ALL", "POPULAR", "LATEST"].map((t, i) => (
                <button
                  key={t}
                  className={`px-6 py-2 text-xs font-bold rounded-full ${
                    i === 0
                      ? "bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black"
                      : "text-[#c2c6d6]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>

          {/* GRID */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {posts.map((post, i) => (
              <motion.div key={i} variants={item} whileHover={{ y: -10 }}>
                <div className="bg-[#171f33] rounded-xl overflow-hidden">
                  <div className="h-56 overflow-hidden">
                    <motion.img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="p-6">
                    <span className="text-xs text-[#adc6ff] font-bold uppercase">
                      {post.tag}
                    </span>

                    <h3 className="text-xl font-black text-white mt-2 mb-3">
                      {post.title}
                    </h3>

                    <p className="text-[#c2c6d6] text-sm mb-6">{post.desc}</p>

                    <motion.button
                      whileHover={{ x: 5 }}
                      className="text-xs font-bold text-[#adc6ff] uppercase"
                    >
                      Read More →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
