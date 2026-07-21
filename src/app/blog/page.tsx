"use client";

import Navbar from "@/components/layout/guest/Navbar";
import Footer from "@/components/layout/guest/Footer";
import { motion } from "framer-motion";
import CTA from "@/components/home/CTA";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Spinner from "@/components/home/Spinner";

const Page = () => {
  const {data: session, status} = useSession();
  // console.log(session);
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold text-white font-manrope flex justify-center items-center gap-4">
          <Spinner />
          Inkly
        </div>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <main className="pt-32 px-6 md:px-12 max-w-screen-2xl mx-auto bg-[#0b1326] text-white">
        {/* HERO */}
        <motion.header
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-20 text-center md:text-left"
        >
          <motion.h1 variants={fadeUp} className="text-6xl font-extrabold mb-4">
            Latest Blogs
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-gray-400 text-xl max-w-2xl"
          >
            Discover articles from writers and developers worldwide. Deep dives
            into code, design, and digital architecture.
          </motion.p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* BLOG GRID */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-8 space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <motion.article
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -10 }}
                  className="bg-[#1E293B] rounded-xl overflow-hidden flex flex-col group cursor-pointer"
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      src={`https://picsum.photos/600/400?random=${i}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  <div className="p-6 flex flex-col grow">
                    <span className="text-gray-500 text-xs mb-2">
                      Oct 24, 2024
                    </span>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition">
                      Blog Title Example {i}
                    </h3>

                    <p className="text-gray-400 text-sm mb-6">
                      Exploring modern architectures and developer workflows in
                      scalable systems.
                    </p>

                    <Link
                      href={`/blog/${i}`}
                      className="mt-auto w-[150] text-black text-center bg-linear-to-r from-[#adc6ff] to-[#4d8eff] px-6 py-4 rounded-full text-xs font-semibold uppercase hover:scale-105 transition"
                    >
                      View Article
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* LOAD MORE */}
            <motion.div variants={fadeUp} className="flex justify-center pt-10">
              <button className="px-10 py-3 border border-gray-600 rounded-full text-xs uppercase hover:bg-[#1E293B] transition">
                Load More Articles
              </button>
            </motion.div>
          </motion.div>

          {/* SIDEBAR */}
          <motion.aside
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-4 space-y-10"
          >
            {/* SEARCH */}
            <motion.div
              variants={fadeUp}
              className="bg-[#131b2e] p-6 rounded-xl"
            >
              <h4 className="font-bold mb-4">Search</h4>
              <input
                placeholder="Search..."
                className="w-full bg-[#0b1326] px-4 py-3 rounded-full outline-none"
              />
            </motion.div>

            {/* CATEGORIES */}
            <motion.div
              variants={fadeUp}
              className="bg-[#131b2e] p-6 rounded-xl"
            >
              <h4 className="font-bold mb-4">Categories</h4>

              <div className="space-y-3 text-gray-400">
                <div className="flex justify-between hover:text-white cursor-pointer">
                  <span>Engineering</span>
                  <span>24</span>
                </div>
                <div className="flex justify-between hover:text-white cursor-pointer">
                  <span>UI Design</span>
                  <span>18</span>
                </div>
                <div className="flex justify-between hover:text-white cursor-pointer">
                  <span>Productivity</span>
                  <span>12</span>
                </div>
              </div>
            </motion.div>

            {/* TRENDING */}
            <motion.div
              variants={fadeUp}
              className="bg-[#131b2e] p-6 rounded-xl"
            >
              <h4 className="font-bold mb-4">Trending</h4>

              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-center group cursor-pointer"
                  >
                    <img
                      src={`https://picsum.photos/100/100?random=${i}`}
                      className="w-14 h-14 rounded-md object-cover group-hover:scale-105 transition"
                    />
                    <p className="text-sm group-hover:text-blue-400">
                      Trending blog post title {i}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.aside>
        </div>

        {status === "unauthenticated" && <CTA />}
      </main>
      <Footer />
    </>
  );
};

export default Page;
