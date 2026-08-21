"use client";
import { motion } from "framer-motion";
import Link from "next/link";

import React from "react";

export const LoginLeftOverlay = () => {
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0 },
  };
  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-[#0F172A] to-[#1E293B] text-white"
      >
        <motion.div variants={item} className="text-xl font-semibold">
          <Link href={`/`}>Inkly</Link>
        </motion.div>

        <div>
          <motion.h1
            variants={item}
            className="text-5xl font-bold leading-tight mb-6"
          >
            A modern blogging platform for writers and developers
          </motion.h1>
          <motion.p variants={item} className="text-gray-400 max-w-md">
            Experience the ultimate workspace designed for clarity.
          </motion.p>
        </div>

        <motion.div variants={item} className="text-sm text-gray-400">
          Join 5,000+ creators building on Inkly.
        </motion.div>
      </motion.div>
    </>
  );
};
