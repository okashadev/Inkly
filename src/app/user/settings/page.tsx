"use client";

import { motion } from "framer-motion";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNav } from "@/components/dashboard/top-nav";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* <AppSidebar />
      <TopNav /> */}
      <main>
        <div className="overflow-y-auto md:px-12 py-16 space-y-24 bg-[#0F172A] text-[#F8FAFC] pb-32">
          {/* HERO */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl font-extrabold tracking-tight mb-2">
              Settings
            </h2>
            <p className="text-[#CBD5F5] text-lg">
              Manage your account and preferences
            </p>
          </motion.section>

          {/* PROFILE */}
          <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4 sticky top-24">
              <h3 className="text-2xl font-bold mb-4">Profile</h3>
              <p className="text-[#CBD5F5] text-sm">
                This information will be displayed publicly.
              </p>
            </div>

            <div className="md:col-span-8 space-y-10">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-8"
              >
                <div className="relative group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlDnWg4pWdVceYJ0h3yxXGFFyItasLZdGnSbGoWnOuigA-ZFjCXa_XPqH7obZ--xA1wzmukZkaiVL-HFp0AQ-4_QUJM8uPUDD1c4IiHSi7eDRiaUJfy8cE-fT6bAVdGHxkPDtxNCI5QW113GmLkaZvKbncgXkNj9hL8cQJCSCjXscK_i5f5voYjowG-RylTw9-nfRKYi2c1bGVFDzHBVECfgLLql590siBPrU9tYuQyvvL_xjlrkKAyDHM0tXlclTWdmVEXvH_Ju5ffx9"
                    className="w-32 h-32 rounded-xl object-cover border border-white/10 opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition">
                    <span className="material-symbols-outlined text-white text-3xl">
                      photo_camera
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-1">Avatar</h4>
                  <p className="text-[#CBD5F5] text-xs mb-4">
                    JPG, PNG up to 800KB
                  </p>

                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-[#1E293B] rounded-lg text-xs hover:bg-[#334155] transition">
                      Upload
                    </button>
                    <button className="px-4 py-2 text-red-400 text-xs hover:bg-red-500/10 rounded-lg transition">
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-6">
                <input
                  className="bg-[#1E293B] p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Full Name"
                  defaultValue="Alexander Inkwell"
                />
                <input
                  className="bg-[#1E293B] p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Username"
                  defaultValue="@alexink"
                />
              </div>

              <textarea
                className="w-full bg-[#1E293B] p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                rows={4}
                defaultValue="I'm a designer and writer exploring digital architecture."
              />

              <input
                className="w-full bg-[#1E293B] p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://twitter.com/..."
              />
            </div>
          </section>

          {/* ACCOUNT */}
          <section className="max-w-4xl mx-auto grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4 sticky top-24">
              <h3 className="text-2xl font-bold mb-4">Account</h3>
              <p className="text-[#CBD5F5] text-sm">
                Security and account settings
              </p>
            </div>

            <div className="md:col-span-8 space-y-8">
              <div className="bg-[#1E293B] p-8 rounded-2xl space-y-6">
                <div className="flex justify-between">
                  <span>Email</span>
                  <span className="text-green-400 text-xs">Verified</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>2FA</span>
                  <div className="w-11 h-6 bg-blue-500 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full bg-[#1E293B] p-4 rounded-xl"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full bg-[#1E293B] p-4 rounded-xl"
                />
              </div>
            </div>
          </section>

          {/* PREFERENCES */}
          <section className="max-w-4xl mx-auto grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4 sticky top-24">
              <h3 className="text-2xl font-bold mb-4">Preferences</h3>
            </div>
          </section>

          {/* DANGER */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-red-500/10 border border-red-500/20 p-10 rounded-2xl flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">
                  Danger Zone
                </h3>
                <p className="text-red-300/70 text-sm">
                  This action cannot be undone.
                </p>
              </div>

              <button className="px-8 py-4 bg-red-500 rounded-xl font-bold hover:bg-red-600 transition">
                Delete Account
              </button>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
