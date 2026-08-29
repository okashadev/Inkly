"use client";

import { LayoutDashboard, FileText, User2Icon, Settings, X, UserPenIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdTravelExplore } from "react-icons/md";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, url: "/user/dashboard" },
  { label: "My Blogs", icon: FileText, url: "/user/my_blogs" },
  { label: "Explore", icon: MdTravelExplore, url: "/blog" },
  { label: "Profile Edit", icon: UserPenIcon, url: "/user/profile" },
  { label: "Settings", icon: Settings, url: "/user/settings" },
];

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ isOpen = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border/30 bg-background/95 px-4 py-6 backdrop-blur-xl transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        aria-label="Main navigation"
      >
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between px-3">
          <div>
            <Link
              href="/"
              onClick={onClose}
              className="font-display text-2xl font-extrabold tracking-tight text-foreground hover:opacity-90"
            >
              Inkly
            </Link>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
              Editorial Dashboard
            </p>
          </div>

          {/* Close Button on Mobile */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url;

            return (
              <Link
                key={item.label}
                href={item.url}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground hover:translate-x-1"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}