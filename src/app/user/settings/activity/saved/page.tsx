"use client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import Link from "next/link";
import Spinner from "@/components/home/Spinner";
import { useSession } from "next-auth/react";
import { User } from "@/types/user";
import { motion } from "framer-motion";
import { HiArrowLeft, HiBookmark } from "react-icons/hi2";

const MOCK_SAVED = [
  {
    id: "3",
    title: "Complete Guide to Prisma Schema Design",
    category: "Database",
    date: "Saved 3 days ago",
  },
];

export default function SavedActivity() {
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
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
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
                <HiBookmark className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Saved Bookmarks
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Articles and guides saved to your reading list.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {MOCK_SAVED.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-[#1C2745] rounded-xl border border-white/5 hover:border-white/20 transition"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-semibold border border-purple-500/30">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-semibold text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400">{item.date}</p>
                  </div>
                  <HiBookmark className="w-5 h-5 text-purple-400" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </DashboardShell>
  );
}
