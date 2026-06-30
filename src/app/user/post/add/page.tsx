"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { redirect } from "next/navigation";
// import { auth } from "@/auth";

export default function NewPost() {
  const [title, setTitle] = useState("Untitled Story...");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");

  // const session = await auth();

  //   if (!session || !session.user) {
  //     redirect("/login");
  //   }

  //   const user = session.user;

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen">
      <AppSidebar />
      {/* NAVBAR */}
      <nav className="fixed left-0 right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-border/30 bg-background/70 px-6 backdrop-blur-xl md:left-64 md:px-12">
        <div className="flex items-center gap-8">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent outline-none text-lg w-64 md:w-96 text-slate-300 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 uppercase">
            Auto-saved
          </div>

          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-blue-400 px-4 py-2 transition active:scale-95">
              Save Draft
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="bg-linear-to-br from-blue-500 to-blue-700 text-white px-6 py-2 rounded-full text-xs font-bold uppercase shadow-lg"
            >
              Publish
            </motion.button>
          </div>
        </div>
      </nav>

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full" />
      </div>

      <main className="flex">
        {/* EDITOR */}
        <div className="grow flex justify-center pt-24 pb-32 px-6">
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl flex flex-col gap-8"
          >
            {/* HEADER */}
            <div className="space-y-4">
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={1}
                placeholder="Title of your story..."
                className="w-full bg-transparent outline-none text-5xl md:text-7xl font-extrabold resize-none placeholder:text-slate-600"
              />

              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                placeholder="Add a subtitle..."
                className="w-full bg-transparent outline-none text-xl text-slate-400 resize-none"
              />
            </div>

            {/* BODY */}
            <div className="relative group min-h-125">
              {/* FLOATING BUTTON */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -left-16 top-0 hidden md:flex flex-col gap-4"
              >
                <button className="w-10 h-10 rounded-full bg-slate-800 text-blue-400 hover:bg-blue-500 hover:text-white transition">
                  +
                </button>
              </motion.div>

              {/* EDITOR */}
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setContent((e.target as HTMLElement).innerText)}
                className="w-full outline-none text-lg text-slate-300 leading-relaxed min-h-100"
              >
                <p className="text-slate-500">Start writing your story...</p>
              </div>

              {/* SLASH HINT */}
              <div className="mt-8 text-sm text-slate-500 flex gap-2">
                <span className="bg-slate-700 px-1 rounded text-xs">/</span>
                Type to insert images, blocks, or code...
              </div>
            </div>
          </motion.article>
        </div>

        {/* SIDEBAR */}
        <aside className="fixed right-0 top-0 h-screen w-80 bg-slate-900 shadow-[-10px_0_30px_rgba(0,0,0,0.2)] pt-24 px-6 hidden lg:flex flex-col">
          <h3 className="text-sm uppercase text-white mb-6">Post Settings</h3>

          {/* READING TIME */}
          <div className="bg-[#1E293B] p-4 rounded-xl mb-6 flex justify-between">
            <div>
              <p className="text-xs text-slate-400">Reading Time</p>
              <p className="font-bold">8 min</p>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-6">
            <label className="text-xs text-slate-400 mb-2 block">
              Category
            </label>

            <select className="w-full bg-[#1E293B] p-3 rounded-lg text-sm">
              <option>Writing</option>
              <option>Product</option>
            </select>
          </div>

          {/* TAGS */}
          <div className="mb-6">
            <label className="text-xs text-slate-400 mb-2 block">Tags</label>

            <input
              placeholder="Add tag..."
              className="w-full bg-[#1E293B] p-3 rounded-lg"
            />
          </div>

          {/* IMAGE */}
          <div className="mb-6">
            <div className="aspect-video bg-[#1E293B] rounded-lg overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRXlDjuKhKVeM5ywEC16RnZ8dREYKqTlBcEaYtMEiM4wkrOr-ghVGlben9uusPo3jYBPzzs5-kHjz0HIMLbswTmhCppP_wV3Tc3rA9ZTeVxQ5tpYI6QUSSl6VP_w54UBdUXRoaA_GVzH3e6SES3N5Br3kbTVtsBfzghSfuhHunFRVYfdEyG9Rnp6TDhfZdqae0yh5hgslFcndADR5CTR8omJo6MxzeBOi0qm0dcTi-fk9CxKNcvgOb2i5F3YUfJl9btzkATyyLFTev"
                alt="cover"
                width={400}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <button className="mt-auto bg-[#1E293B] py-4 rounded-xl text-sm">
            Preview Mode
          </button>
        </aside>
      </main>

      {/* MOBILE BAR */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-800 flex justify-around items-center md:hidden">
        <button>✍️</button>
        <button>👁️</button>
        <button>⚙️</button>
        <button>🚀</button>
      </div>
    </div>
  );
}
