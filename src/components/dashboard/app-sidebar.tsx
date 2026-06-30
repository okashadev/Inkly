"use client";
import { LayoutDashboard, FileText, LineChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Posts", icon: FileText, active: false },
  { label: "Analytics", icon: LineChart, active: false },
  { label: "Settings", icon: Settings, active: false },
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
            <a
              key={item.label}
              href="#"
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
            </a>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <button
          onClick={() =>
            signOut({
              callbackUrl: "/login",
            })
          }
          type="button"
          className="w-full rounded-full bg-linear-to-br from-primary to-primary-container py-4 font-display text-sm font-bold tracking-tight text-on-primary-container shadow-lg shadow-primary/10 transition-all hover:brightness-110 active:scale-95"
        >
          Write New Blog
        </button>
      </div>
    </aside>
  );
}
