"use client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SettingsItem } from "@/components/settings/SettingsItem";
import Spinner from "@/components/home/Spinner";
import { useSession } from "next-auth/react";
import { User } from "@/types/user";
import { motion } from "framer-motion";
import {
  HiKey,
  HiHeart,
  HiBookmark,
  HiChatBubbleLeftEllipsis,
  HiShieldCheck,
  HiClock,
  HiCheckBadge,
} from "react-icons/hi2";
import { useEffect, useState } from "react";

export default function SettingsHub() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const user = session?.user as User;

  if (!mounted || (status === "loading" && !session)) {
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
    <DashboardShell user={user}>
      <main className="lg:pl-64 pt-20 transition-all duration-300 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 space-y-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-white/10 pb-6"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Settings & Account
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Manage your security preferences, password, and view your
              interactions.
            </p>
          </motion.div>

          {/* User Profile Quick Overview Card */}
          <div className="p-4 bg-[#131C35]/60 border border-white/10 rounded-2xl flex items-center justify-between backdrop-blur-sm">
            <div>
              <p className="text-xs text-slate-400">Primary Account Email</p>
              <p className="text-sm font-semibold text-white mt-0.5">
                {user?.email || "user@example.com"}
              </p>
            </div>
            {user?.emailVerified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                <HiCheckBadge className="w-4 h-4" />
                Verified
              </span>
            )}
          </div>

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-white font-bold text-lg border-b border-white/5 pb-2">
              <HiShieldCheck className="w-5 h-5 text-blue-500" />
              <h2>Security & Credentials</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <SettingsItem
                title="Password & Security"
                description="Update your password and delete your account"
                icon={HiKey}
                href="/user/settings/security"
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-white font-bold text-lg border-b border-white/5 pb-2">
              <HiClock className="w-5 h-5 text-blue-500" />
              <h2>Your Activity</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <SettingsItem
                title="Liked Posts"
                description="View articles and posts you have liked"
                icon={HiHeart}
                href="/user/settings/activity/likes"
              />
              <SettingsItem
                title="Saved Bookmarks"
                description="Access reading list items saved for later"
                icon={HiBookmark}
                href="/user/settings/activity/saved"
              />
              <SettingsItem
                title="Comments History"
                description="Review your past comments and replies"
                icon={HiChatBubbleLeftEllipsis}
                href="/user/settings/activity/comments"
              />
            </div>
          </motion.section>
        </div>
      </main>
    </DashboardShell>
  );
}
