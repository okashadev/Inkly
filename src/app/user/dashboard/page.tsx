"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentPosts } from "@/components/dashboard/recent-posts"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { TrendingTopics } from "@/components/dashboard/trending-topics"
// import { GrowthChart } from "@/components/dashboard/growth-chart"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />
      <TopNav />

      <main className="grid min-h-screen grid-cols-1 gap-8 px-6 pb-12 pt-28 md:pl-72 md:pr-12 lg:grid-cols-12">
        {/* Content Area */}
        <div className="space-y-12 lg:col-span-8">
          {/* Welcome Header */}
          <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Dashboard
              </h2>
              <h3 className="text-balance font-display text-4xl font-extrabold tracking-tighter text-foreground md:text-5xl">
                Welcome back, Alex
              </h3>
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-linear-to-br from-primary to-primary-container py-4 font-display text-sm font-bold tracking-tight text-on-primary-container shadow-lg shadow-primary/10 md:hidden"
            >
              Write New Blog
            </button>
          </section>

          <StatsCards />
          <RecentPosts />
        </div>

        {/* Right Rail */}
        <aside className="space-y-8 lg:col-span-4">
          <QuickActions />
          {/* <GrowthChart /> */}
          <TrendingTopics />
        </aside>
      </main>
    </div>
  )
}
