"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layout/guest/Navbar";
import Footer from "@/components/layout/guest/Footer";
import CTA from "@/components/home/CTA";
// const Page = () => {
//   return (
//     <>
//       <Navbar />
//       <main className="pt-32 px-6 md:px-12 max-w-screen-2xl h-screen mx-auto bg-[#0b1326] text-white">
//       </main>
//       <Footer />
//     </>
//   )
// }

// export default Page

export default function BlogDetailPage() {
  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen font-body">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <main className="pt-32 px-6 max-w-7xl mx-auto relative">
        {/* TOC */}
        <aside className="absolute right-10 top-48 w-64 hidden xl:flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-widest text-slate-300">
            Table of Contents
          </h4>

          {[
            ["Introduction", "#intro"],
            ["Core Concepts", "#concepts"],
            ["Implementation", "#impl"],
            ["Summary", "#summary"],
          ].map(([label, link]) => (
            <a
              key={label}
              href={link}
              className="text-slate-500 border-l-2 border-slate-800 pl-4 hover:text-white hover:border-slate-500"
            >
              {label}
            </a>
          ))}
        </aside>

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-200 mb-12"
        >
          <span className="inline-flex px-4 py-1 bg-[#1f2a44] text-blue-300 rounded-full text-sm mb-6">
            Engineering
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 font-headline">
            The Future of Asynchronous Design in Distributed Systems
          </h1>

          <p className="text-xl text-slate-300 mb-8">
            How modern event-driven architectures are reshaping scalability.
          </p>

          {/* AUTHOR */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_y3y3VufQbtV_hoXsKiBaT2KjUqopCqVHVJyseUcRYbAywFf8W-lv6d0QciOJMNYXdXf3N2LR0tIq5Udwou4aX0eI3UbpXxHwDS0axncyFNX7-EHca3zXIRPbbgUZ8SiOBJ9WRSA-Na7nZpVwb9VG77oomlPwgb03suPvHpeG10uru2cCedw1XMGRILRBlrAzUF6gZJtyDKeljxhQ5rvR6KFJCMyQiMbGUGPWaERW7WARyRqucc4fnMTu0nVYdf8HhS0A0qKH1Own"
                alt="author"
                width={48}
                height={48}
              />
            </div>

            <div>
              <p className="font-semibold">Alex Rivers</p>
              <p className="text-sm text-slate-400">
                Oct 24, 2024 • 12 min read
              </p>
            </div>
          </div>
        </motion.header>

        {/* FEATURE IMAGE */}
        <div className="mb-16 rounded-lg overflow-hidden">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9D4oYAOOOu99hv3i-Y3Cu-hteqJmNFW8od_6zuARTzFdwVIWMnOyjclmVwCvuz9NLPPQskS41eugbymZ4oZH0c_BKNhYqzeQwGWObdJIKEIw6zwAFwbl1oLYnJfWfDn3AiWqB903yFVvTeFGl7C0b2N8ztOmlz8ArTrzqrCTQfeX0lG1uCIhH734jiJN15uPdv6Nb-YWISX2MtfV8Jsb7VXm41cNnP-wJj7RWk3no_cUgGCqTkr8WhXTKAUl4MjbQQlaR7MNrUs2h"
            alt="feature"
            width={1200}
            height={500}
            className="w-full object-cover aspect-21/9"
          />
        </div>

        {/* CONTENT */}
        <div className="max-w-175 mx-auto space-y-10">
          <p id="intro" className="text-lg leading-8">
            As distributed systems evolve, asynchronous patterns become
            essential...
          </p>

          <blockquote className="border-l-4 border-blue-500 pl-6 italic text-xl text-slate-300">
            "The most resilient systems handle failure asynchronously..."
          </blockquote>

          <h2 id="concepts" className="text-3xl font-bold">
            Core Concepts: Beyond Webhooks
          </h2>

          <p className="text-lg leading-8 text-slate-300">
            Traditional request-response creates tight coupling between
            services...
          </p>

          {/* CODE BLOCK */}
          <div className="bg-[#060e20] p-6 rounded-lg font-mono text-sm overflow-x-auto">
            <pre className="text-slate-300">
              {`async function handleSystemUpdate(payload) {
        const event = await inkly.publish("system.updated", {
            data: payload,
            idempotencyKey: payload.uuid,
            retry: { backoff: "exponential", attempts: 5 }
        });

        return { status: "processing", traceId: event.id };
        }`}
            </pre>
          </div>

          <h2 id="impl" className="text-3xl font-bold">
            Implementing Durable Workflows
          </h2>

          <p className="text-slate-300 text-lg leading-8">
            Implementation involves persisting state across execution steps...
          </p>
        </div>

        {/* AUTHOR CARD */}
        <div className="my-20 p-8 bg-[#131b2e] rounded-lg flex flex-col md:flex-row items-center gap-8">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_y3y3VufQbtV_hoXsKiBaT2KjUqopCqVHVJyseUcRYbAywFf8W-lv6d0QciOJMNYXdXf3N2LR0tIq5Udwou4aX0eI3UbpXxHwDS0axncyFNX7-EHca3zXIRPbbgUZ8SiOBJ9WRSA-Na7nZpVwb9VG77oomlPwgb03suPvHpeG10uru2cCedw1XMGRILRBlrAzUF6gZJtyDKeljxhQ5rvR6KFJCMyQiMbGUGPWaERW7WARyRqucc4fnMTu0nVYdf8HhS0A0qKH1Own"
            alt="author"
            width={96}
            height={96}
            className="rounded-full"
          />

          <div>
            <h3 className="text-2xl font-bold">Alex Rivers</h3>
            <p className="text-slate-400 mb-4">Software Architect at Inkly</p>

            <div className="flex gap-4 text-sm">
              <span>Twitter</span>
              <span>GitHub</span>
            </div>
          </div>
        </div>
        {/* CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
