import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-8 overflow-hidden">
      <div className="absolute w-96 h-96 bg-blue-500/10 blur-3xl -top-20 -left-20 rounded-full" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9]">
            Write.
            <br />
            Publish.
            <br />
            <span className="text-blue-400">Inspire.</span>
          </h1>

          <p className="text-slate-400 max-w-lg">
            Inkly makes blogging seamless for creators. <br /> A minimalist
            workspace designed for the modern digital <br />
            architect to craft their legacy.
          </p>

          <Link
            href={`/register`}
            className="bg-linear-to-r mt-4 from-[#adc6ff] to-[#4d8eff] px-8 py-4 rounded-full font-bold uppercase"
          >
            Get Started
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Image
            src="/assets/img/hero-section-img.png"
            alt="Hero Image"
            width={500}
            height={500}
            className="rounded-xl h-auto opacity-80"
          />
        </motion.div>
      </div>
    </section>
  );
}
