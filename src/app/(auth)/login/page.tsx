"use client";
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { motion } from "framer-motion";

const Page = () => {
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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-[#0F172A] to-[#1E293B] text-white"
      >
        <motion.div variants={item} className="text-xl font-semibold">
          Inkly
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

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-background p-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
