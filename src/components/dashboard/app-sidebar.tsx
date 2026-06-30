"use client";
import { LayoutDashboard, FileText, User2Icon, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    active: false,
    url: "/user/dashboard",
  },
  {
    label: "My Blogs",
    icon: FileText,
    active: false,
    url: "/user/my_blogs",
  },
  {
    label: "Explore",
    icon: FileText,
    active: false,
    url: "/blog",
  },
  {
    label: "Profile",
    icon: User2Icon,
    active: false,
    url: "/user/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    active: false,
    url: "/user/settings",
  },
];

export function AppSidebar() {
  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-8 md:flex"
      aria-label="Main navigation"
    >
      <div className="mb-12 px-4">
        <h1 className="font-display text-xl font-extrabold tracking-tight text-primary">
          Inkly
        </h1>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
          Editorial Dashboard
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.url}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:translate-x-1 hover:bg-accent hover:text-foreground",
              )}
              aria-current={item.active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2 w-full">
        <Link
          href={"/user/post/add"}
          type="button"
          className="w-full rounded-full px-12 bg-linear-to-br from-primary to-primary-container py-4 font-display text-sm font-bold tracking-tight text-on-primary-container shadow-lg shadow-primary/10 transition-all hover:brightness-110 active:scale-95"
        >
          Write New Blog
        </Link>
      </div>
    </aside>
  );
}
