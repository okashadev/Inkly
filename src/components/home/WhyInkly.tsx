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
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const WhyInkly = () => {
  return (
    <section className="relative py-20 px-4 sm:px-8 bg-[#0b1326] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">
            Why Choose Inkly?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
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
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              icon: <FaEdit />,
              title: "Clean Writing",
              desc: "A clean, distraction-free workspace that lets your creativity flow.",
            },
            {
              icon: <RiBracesFill />,
              title: "Markdown Support",
              desc: "Full syntax support for developers and technical writers.",
            },
            {
              icon: <IoFlashOutline />,
              title: "Fast Publishing",
              desc: "Instant global deployment with lightning-fast performance.",
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
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-[#0b132b] p-6 rounded-2xl border border-white/10 hover:border-blue-500/40 flex flex-col gap-4 items-start transition-all shadow-xl"
            >
              <div className="bg-blue-500/10 p-3.5 rounded-xl border border-blue-500/20 text-blue-400 text-2xl">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="bg-white/10 w-full h-px my-16"></div>

        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-3 max-w-3xl mx-auto gap-4 sm:gap-8"
        >
          {[
            { value: "5,000+", label: "Writers" },
            { value: "20k+", label: "Articles" },
            { value: "1M+", label: "Reads" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={container}
              className="text-center"
            >
              <h3 className="text-3xl sm:text-5xl text-blue-400 font-extrabold tracking-tight">
                {stat.value}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyInkly;