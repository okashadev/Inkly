"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentPosts } from "@/components/dashboard/recent-posts";
import { QuickActions } from "@/components/dashboard/quick-actions";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import Spinner from "@/components/home/Spinner";
import { useRouter } from "next/navigation";
import { Post } from "@/types/post";
import { User, UserStats } from "@/types/user";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardPage() {
  const [recentPost, setRecentPost] = useState<Post[] | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getUserData() {
      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        } else if (res.status === 200) {
          const resData = await res.json();
          if (resData.success) {
            setUser(resData.data?.user);
            setRecentPost(resData.data?.recentPosts);
            setStats(resData.data?.stats);
          }
        }
      } catch (error: any) {
        console.error("Fetch User Data Error:", error);
      } finally {
        setLoading(false);
      }
    }

    getUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold text-white font-manrope flex justify-center items-center gap-4">
          <Spinner />
          Inkly
        </div>
      </div>
    );
  }

  return (
    <DashboardShell user={user}>
      <main className="grid min-h-screen grid-cols-1 gap-8 px-6 pb-12 pt-22 md:pl-72 md:pr-12 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <section className="flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant/10 bg-surface-container-low p-6 md:p-8">
            <div>
              <h3 className="text-balance font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                Welcome back, {user?.name || "Writer"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Here is what is happening with your content today.
              </p>
            </div>

            <Link
              href="/user/post/add"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-display text-sm font-bold text-primary-foreground shadow-sm transition-all hover:opacity-90 md:hidden"
            >
              <SquarePen className="h-4 w-4" />
              Write New Blog
            </Link>
          </section>

          <StatsCards stats={stats} />
          <RecentPosts posts={recentPost} />
        </div>

        {/* Sidebar Actions */}
        <aside className="space-y-6 lg:col-span-4">
          <QuickActions />
        </aside>
      </main>
    </DashboardShell>
  );
}