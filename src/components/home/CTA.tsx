"use client";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const CTA = () => {
  return (
    <section className="relative py-30 px-8 bg-[#0b1326] text-white text-center overflow-hidden">

      {/* 🔵 Glow Background (FIXED) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-100 h-100 bg-blue-500 blur-[120px] rounded-full"
      />

      {/* 🔥 Content */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <motion.h2
          variants={item}
          className="text-5xl font-bold mb-6"
        >
          Start your writing journey <br /> today
        </motion.h2>

        <motion.p
          variants={item}
          className="text-gray-400 mb-8"
        >
          Join a community of digital architects crafting their legacy on the most elegant <br />
          publishing platform.
        </motion.p>

        <motion.a
          variants={item}
          whileHover={{
            scale: 1.08,
            boxShadow: "0px 10px 40px rgba(77,142,255,0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          href="/register"
          className="bg-linear-to-r from-[#adc6ff] to-[#4d8eff] px-8 py-4 rounded-full font-bold uppercase inline-block transition-all"
        >
          Get Started
        </motion.a>
      </motion.div>
    </section>
  );
};

export default CTA;