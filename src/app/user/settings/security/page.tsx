"use client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import Link from "next/link";
import Spinner from "@/components/home/Spinner";
import { useSession } from "next-auth/react";
import { User } from "@/types/user";
import { motion } from "framer-motion";
import {
  HiArrowLeft,
  HiKey,
  HiExclamationTriangle,
  HiLockClosed,
} from "react-icons/hi2";

export default function SecuritySettings() {
  const { data: session, status } = useSession();
  const user = session?.user as User;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <DashboardShell user={user}>
      <main className="lg:pl-64 pt-20 transition-all duration-300 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          {/* Back Navigation */}
          <Link
            href="/user/settings"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition group"
          >
            <HiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Settings
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Password & Security
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Manage credentials and permanent account decisions.
              </p>
            </div>

            {/* Change Password Card */}
            <div className="bg-[#131C35]/60 p-6 sm:p-8 rounded-2xl border border-white/10 backdrop-blur-sm space-y-6">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-white/5 pb-4">
                <HiKey className="w-5 h-5 text-blue-400" />
                <h3>Change Password</h3>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full bg-[#1C2745] border border-white/10 rounded-xl p-3 pl-10 text-sm text-white focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500"
                    />
                    <HiLockClosed className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full bg-[#1C2745] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full bg-[#1C2745] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition active:scale-95 shadow-md shadow-blue-600/20"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone Card */}
            <div className="bg-red-500/10 border border-red-500/20 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                  <HiExclamationTriangle className="w-5 h-5 shrink-0" />
                  <span>Delete Your Account</span>
                </div>
                <p className="text-red-300/80 text-xs leading-relaxed max-w-md">
                  Once deleted, all your articles, draft posts, and account
                  settings will be permanently removed.
                </p>
              </div>

              <button
                type="button"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl uppercase tracking-wider transition active:scale-95 shadow-md shadow-red-600/20 shrink-0"
              >
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </DashboardShell>
  );
}
