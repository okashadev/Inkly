"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { useSession } from "next-auth/react";
import Spinner from "@/components/home/Spinner";
import Image from "next/image";
import { 
  HiCheckBadge, 
  HiExclamationTriangle,
  HiShieldCheck,
  HiKey,
  HiHeart,
  HiBookmark,
  HiChatBubbleLeftEllipsis,
  HiClock,
  HiCog6Tooth
} from "react-icons/hi2";

// Dummy data structure - Aap ise apne DB/API call se replace kar sakte hain
const MOCK_LIKES = [
  { id: "1", title: "Mastering Next.js 15 & Server Actions", category: "Development", date: "2 hours ago" },
  { id: "2", title: "Designing Dark Mode UIs with Tailwind CSS", category: "Design", date: "1 day ago" },
];

const MOCK_SAVED = [
  { id: "3", title: "Complete Guide to Prisma Schema Design", category: "Database", date: "Saved 3 days ago" },
];

const MOCK_COMMENTS = [
  { id: "4", title: "Building Fullstack Apps with NextAuth v5", comment: "This saved me hours of debugging!", date: "Yesterday" },
];

export default function Settings() {
  const { data: session, status } = useSession();
  const user = session?.user;
  
  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState<"security" | "activity">("security");
  const [activityFilter, setActivityFilter] = useState<"likes" | "saved" | "comments">("likes");
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-xl font-bold text-white font-manrope flex justify-center items-center gap-4">
          <Spinner />
          <span>Inkly</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B132B] text-[#F8FAFC]">
      <AppSidebar />
      <TopNav user={user} />

      <main className="lg:pl-64 pt-20 transition-all duration-300 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 space-y-8">
          
          {/* Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border-b border-white/10 pb-6"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Settings & Activity
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Manage security preferences, login authentication, and view your platform interactions.
            </p>

            {/* Main Tabs Header */}
            <div className="flex gap-4 mt-6 border-b border-white/5 pb-0.5">
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "security"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <HiCog6Tooth className="w-5 h-5" />
                Security & Account
              </button>

              <button
                onClick={() => setActiveTab("activity")}
                className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "activity"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <HiClock className="w-5 h-5" />
                Your Activity
              </button>
            </div>
          </motion.section>

          {/* TAB CONTENT SWITCHING */}
          <AnimatePresence mode="wait">
            {activeTab === "security" ? (
              <motion.div
                key="security-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-10"
              >
                {/* SECTION 1: SECURITY & LOGIN */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-white/10 pb-10">
                  <div className="md:col-span-4">
                    <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                      <HiShieldCheck className="w-6 h-6 text-blue-500" />
                      <h3>Security & Login</h3>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      Manage your primary credentials and multi-factor authentication methods.
                    </p>
                  </div>

                  <div className="md:col-span-8 space-y-6 bg-[#131C35]/60 p-6 sm:p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                    {/* Email Status */}
                    <div className="flex items-center justify-between p-4 bg-[#1C2745] rounded-xl border border-white/5">
                      <div>
                        <p className="text-xs text-slate-400">Primary Email</p>
                        <p className="text-sm font-semibold text-white mt-0.5">{user?.email || "user@example.com"}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                        <HiCheckBadge className="w-4 h-4" />
                        Verified
                      </span>
                    </div>

                    {/* 2FA Toggle */}
                    <div className="flex items-center justify-between p-4 bg-[#1C2745] rounded-xl border border-white/5">
                      <div>
                        <p className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</p>
                        <p className="text-xs text-slate-400 mt-0.5">Adds an extra layer of security to your account.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative duration-200 cursor-pointer ${
                          is2FAEnabled ? "bg-blue-600" : "bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                            is2FAEnabled ? "right-1" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Password Fields */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        <HiKey className="w-4 h-4 text-blue-400" />
                        <span>Change Password</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full bg-[#1C2745] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full bg-[#1C2745] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button type="button" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition active:scale-95">
                        Update Password
                      </button>
                    </div>
                  </div>
                </section>

                {/* SECTION 2: DANGER ZONE */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-4">
                    <h3 className="text-xl font-bold text-red-400 mb-1">Danger Zone</h3>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      Irreversible account actions and permanent data deletion.
                    </p>
                  </div>

                  <div className="md:col-span-8 bg-red-500/10 border border-red-500/20 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                        <HiExclamationTriangle className="w-5 h-5 shrink-0" />
                        <span>Delete Your Account</span>
                      </div>
                      <p className="text-red-300/80 text-xs leading-relaxed">
                        Once deleted, all your articles, draft posts, and settings will be permanently erased.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl uppercase tracking-wider transition active:scale-95 shadow-md shadow-red-600/20 shrink-0"
                    >
                      Delete Account
                    </button>
                  </div>
                </section>
              </motion.div>
            ) : (
              /* TAB 2: ACTIVITY SECTION (INSTAGRAM STYLE) */
              <motion.div
                key="activity-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Activity Sub-Filter Buttons */}
                <div className="flex flex-wrap gap-3 bg-[#131C35]/60 p-2 rounded-xl border border-white/10 w-fit">
                  <button
                    onClick={() => setActivityFilter("likes")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                      activityFilter === "likes"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <HiHeart className={`w-4 h-4 ${activityFilter === "likes" ? "text-red-400" : ""}`} />
                    Likes
                  </button>

                  <button
                    onClick={() => setActivityFilter("saved")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                      activityFilter === "saved"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <HiBookmark className="w-4 h-4" />
                    Saved Bookmarks
                  </button>

                  <button
                    onClick={() => setActivityFilter("comments")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                      activityFilter === "comments"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <HiChatBubbleLeftEllipsis className="w-4 h-4" />
                    Comments
                  </button>
                </div>

                {/* Filter Items Render */}
                <div className="bg-[#131C35]/60 p-6 rounded-2xl border border-white/10 backdrop-blur-sm min-h-75">
                  {activityFilter === "likes" && (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Posts You Liked
                      </p>
                      {MOCK_LIKES.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-[#1C2745] rounded-xl border border-white/5 hover:border-white/20 transition">
                          <div className="space-y-1">
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold">{item.category}</span>
                            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                            <p className="text-xs text-slate-400">{item.date}</p>
                          </div>
                          <HiHeart className="w-5 h-5 text-red-500" />
                        </div>
                      ))}
                    </div>
                  )}

                  {activityFilter === "saved" && (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Saved for Later
                      </p>
                      {MOCK_SAVED.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-[#1C2745] rounded-xl border border-white/5 hover:border-white/20 transition">
                          <div className="space-y-1">
                            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-semibold">{item.category}</span>
                            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                            <p className="text-xs text-slate-400">{item.date}</p>
                          </div>
                          <HiBookmark className="w-5 h-5 text-blue-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {activityFilter === "comments" && (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Your Recent Comments
                      </p>
                      {MOCK_COMMENTS.map((item) => (
                        <div key={item.id} className="p-4 bg-[#1C2745] rounded-xl border border-white/5 space-y-2 hover:border-white/20 transition">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                            <span className="text-xs text-slate-400">{item.date}</span>
                          </div>
                          <div className="p-3 bg-[#131C35] rounded-lg border border-white/5 text-xs text-slate-300 italic">
                            "{item.comment}"
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}