"use client";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { RiBracesFill } from "react-icons/ri";
import { IoFlashOutline } from "react-icons/io5";
import { MdOutlineCode } from "react-icons/md";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const WhyInkly = () => {
  return (
    <section className="relative pt-20 px-8 bg-[#0b1326] text-white">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-6 text-center">
          Why Choose Inkly?
        </h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto">
          Experience the next generation of digital publishing with tools
          crafted for architectural precision.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-12 grid md:grid-cols-4 gap-6"
      >
        {[ 
          {
            icon: <FaEdit />,
            title: "Clean Writing Experience",
            desc: "A clean, distraction-free workspace that lets your creativity flow.",
          },
          {
            icon: <RiBracesFill />,
            title: "Markdown Support",
            desc: "Full syntax support for developers and technical writers who love formatting.",
          },
          {
            icon: <IoFlashOutline />,
            title: "Fast Publishing",
            desc: "Instant global deployment with lightning-fast CDN performance.",
          },
          {
            icon: <MdOutlineCode />,
            title: "Developer Friendly",
            desc: "Custom APIs and webhooks to integrate with your existing workflows.",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            variants={container}
            whileHover={{
              y: -8,
              scale: 1.02,
            }}
            className="bg-[#1c2541] p-6 rounded-xl flex flex-col gap-4 items-start transition-all"
          >
            <div className="bg-[#2b3555] p-4 rounded-full flex items-center justify-center">
              <span className="text-[#ADC6FF] text-xl">
                {card.icon}
              </span>
            </div>
            <h3 className="text-2xl font-semibold">{card.title}</h3>
            <p className="text-gray-400">{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Divider */}
      <div className="bg-gray-500/20 w-full h-px my-20"></div>

      {/* Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex justify-center gap-12 my-12"
      >
        {[
          { value: "5,000+", label: "Writers" },
          { value: "20k+", label: "Articles" },
          { value: "1M+", label: "Reads" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={container}
            whileHover={{ scale: 1.1 }}
            className="text-center"
          >
            <h1 className="text-5xl text-[#ADC6FF] font-bold">
              {stat.value}
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Divider */}
      <div className="bg-gray-500/20 w-full h-px mt-20"></div>
    </section>
  );
};

export default WhyInkly;