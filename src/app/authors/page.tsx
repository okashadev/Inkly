"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/guest/Navbar";
import Footer from "@/components/layout/guest/Footer";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AuthorsPage() {
  const [search, setSearch] = useState("");

  return (
    <>
    <Navbar />
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-360 mx-auto text-[#dae2fd]">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
            Discover Authors
          </h1>

          <p className="text-lg text-[#c2c6d6] max-w-2xl mx-auto mb-10">
            Explore top writers, engineers, and creators shaping modern web
            content.
          </p>

          {/* SEARCH */}
          <div className="relative max-w-xl mx-auto mb-8">
            <div className="relative flex items-center bg-[#171f33] rounded-full px-6 py-4 border border-[#424754]">
              <span className="text-[#8c909f]">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, expertise..."
                className="bg-transparent w-full px-4 outline-none text-white"
              />
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap justify-center gap-3">
            {["All", "Trending", "Top Rated", "New Writers"].map((tab) => (
              <button
                key={tab}
                className="px-5 py-2 rounded-full text-sm font-medium bg-[#3e495d] hover:bg-[#4d8eff] transition"
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.header>

        {/* TOP AUTHORS */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
            Top Authors This Week
          </h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Alex River",
                username: "@ariver_dev",
                id: 1,
                posts: 142,
                followers: "12.4k",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDvbT40wjhHdnyJU_mGZMquJ2lDrPQ8whOgBjgzC-cwnagLSZTc2NeIT_xQq18st8vpbUvJRJto61uYtdJ79RansYyBXxNLSzTy5hIi-g7KvyzyU35sWdaWNPXa4EiTD8ujmuKSD-Xaszmrg5sZiLlpb70_om7oHNqeUFpwFuQPWj-GI1vBXY9PArPJjotxwZ5UZ-gcbI95pds8EZ29K9shTpImDqVcCGFsMwLb671rtJlv40JV6piee3zzvbvGNqerQ3g4Lu-veFU",
              },
              {
                name: "Sarah Chen",
                username: "@schen_design",
                id: 2,
                posts: 89,
                followers: "45.2k",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDL1PtlWplXJkXNwRSQCWKtXGuqJTxYGpPnybCpVZGfCm9LweziwgXXqKX1weQvm526m0ztRBoi3HnacWko3AXb2zE3oNXGlmixutxvMSKqNhbP1eDHgTPG85EDaLUlcSoBia3KmAFF04679dOkzaV0EE85JvIVN17SoFycrhSJs-Chf4BjhpwON60ejRLZQg-S5nAKo6fski8SSTjTDH_FVUiYs-H-NsrCwCv6y6pZ5iryFGcnKIeQv51CtDb8_cwLjQ_suaOUTWwV",
              },
              {
                name: "Jordan Watts",
                id: 3,
                username: "@jwatts_arch",
                posts: 214,
                followers: "8.9k",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGFnbvSXnk_0X0M48MZhW72xA9I87geENj7dMSgMSCJmvW4EkcRK3T6I7N_OyT_yHJ6MjODPKdsIfSonlTSADcJHrrHSgvFpsYxqb6g97uaQTd2kE31rPUeDZTeDsjVq_nOV0n5mo4wW5gxMcupeRaExnujhTL9Q4GOOjYgvBZ3E1Z9rhILtAL0KAI0fwASXTqgfymMZ_RkxCKU6pGwlLExV4QpQAOe0y9ZwiaDzmRMaM-113GmLkaZvKbncgXkNj9hL8cQJCSCjXscK",
              },
            ].map((a, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ scale: 1.03 }}
                className="bg-[#171f33] p-8 rounded-xl text-center border border-[#2d3449]"
              >
                <img
                  src={a.img}
                  className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-bold">{a.name}</h3>
                <p className="text-[#4d8eff] text-sm mb-4">{a.username}</p>

                <div className="flex justify-center gap-10 mb-6 text-sm">
                  <div>
                    <p className="text-[#8c909f]">Posts</p>
                    <p className="font-bold">{a.posts}</p>
                  </div>
                  <div>
                    <p className="text-[#8c909f]">Followers</p>
                    <p className="font-bold">{a.followers}</p>
                  </div>
                </div>

                <Link
                  href={`/authors/profile/${a.id}`}
                  className="block bg-[#4d8eff] text-black font-bold py-3 rounded-full"
                >
                  View Profile
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* GRID AUTHORS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT GRID */}
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
            {[
              "David Miller",
              "Elena Rodriguez",
              "Marcus Thorne",
              "Julia Vane",
            ].map((name, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-[#131b2e] p-6 rounded-xl border border-[#2d3449]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://i.pravatar.cc/100"
                    className="w-14 h-14 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold">{name}</h4>
                    <p className="text-xs text-[#8c909f]">Creator</p>
                  </div>
                </div>

                <p className="text-sm text-[#c2c6d6] mb-4">
                  Writing about modern systems, UI and backend architecture.
                </p>

                <Link
                  href={`/authors/profile/4`}
                  className="text-[#4d8eff] text-sm font-bold"
                >
                  View Profile →
                </Link>
              </motion.div>
            ))}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-4 bg-[#060e20] p-8 rounded-xl border border-[#2d3449]">
            <h3 className="text-xl font-bold mb-8">Top Creators</h3>

            <ul className="space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <li
                  key={i}
                  className="flex items-center justify-between hover:text-[#4d8eff] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#8c909f]">{i}</span>
                    <img
                      src="https://i.pravatar.cc/40"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-bold">Creator {i}</p>
                      <p className="text-xs text-[#8c909f]">followers</p>
                    </div>
                  </div>
                  <span>📈</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
