"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export const RegisterLeftOverlay = () => {
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
        initial={{ opacity: 0, x: -60 }}
        variants={container}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex md:w-1/2 flex-col justify-between p-16 bg-[#060e20]"
      >
        <motion.div variants={item} className="text-xl font-semibold">
          <Link href={`/`}>Inkly</Link>
        </motion.div>

        <div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Start your writing journey today
          </h1>
          <p className="text-[#c2c6d6] max-w-md">
            Experience the ultimate workspace designed for clarity. Code blocks,
            rich editorial tools, and seamless distribution.
          </p>
        </div>

        <p className="text-sm text-[#8c909f]">
          Join 5,000+ creators building on Inkly
        </p>
      </motion.div>
    </>
  );
};
