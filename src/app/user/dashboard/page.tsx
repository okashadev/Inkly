import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentPosts } from "@/components/dashboard/recent-posts"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { TrendingTopics } from "@/components/dashboard/trending-topics"
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />
      <TopNav user={user} />

      <main className="grid min-h-screen grid-cols-1 gap-8 px-6 pb-12 pt-28 md:pl-72 md:pr-12 lg:grid-cols-12">
        
        <div className="space-y-12 lg:col-span-8">
          
          <section className="flex md:hidden flex-col justify-between gap-6">
            <div>
              <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Dashboard
              </h2>
              <h3 className="text-balance font-display text-3xl font-extrabold tracking-tighter text-foreground">
                Welcome back, {user.name || "User"}
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

        <aside className="space-y-8 lg:col-span-4">
          <QuickActions />
          {/* <GrowthChart /> */}
          {/* <TrendingTopics /> */}
        </aside>
      </main>
    </div>
  )
}
