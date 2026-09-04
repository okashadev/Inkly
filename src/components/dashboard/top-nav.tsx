"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  Menu,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { User } from "@/types/user";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface TopNavProps {
  user: User | null;
  onMenuClick?: () => void;
  initialUnreadCount?: number;
}

export function TopNav({
  user,
  onMenuClick,
  initialUnreadCount = 0,
}: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const routeTitles: Record<string, string> = {
    "/user/dashboard": "Editorial Dashboard",
    "/user/my_blogs": "My Blogs",
    "/user/profile": "Profile Edit",
    "/user/settings": "Settings",
    "/user/notification": "Notifications",
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-18 items-center justify-between border-b border-border/30 bg-background/80 px-4 backdrop-blur-xl md:left-64 md:px-10">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight text-foreground md:hidden"
        >
          Inkly
        </Link>

        <nav className="hidden md:block" aria-label="Primary">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
            {routeTitles[pathname] || ""}
          </h2>
        </nav>
      </div>

      <div className="flex items-center gap-5">
        {user?.id && (
          <NotificationBell
            userId={user.id}
            initialUnreadCount={initialUnreadCount}
          />
        )}

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-transparent transition-all hover:ring-primary/40 focus:outline-none active:scale-95"
            aria-label="Open user menu"
          >
            <Image
              src={user?.image || "/images/userImage.webp"}
              alt={user?.name || "User Avatar"}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 4, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-60 rounded-2xl border border-border/40 bg-background/95 p-2 shadow-xl backdrop-blur-2xl z-50"
              >
                {/* User Information Header */}
                <div className="px-3 py-2">
                  <Link href={`/authors/profile/${user?.id}`}>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user?.name || "Writer"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || "user@inkly.com"}
                    </p>
                  </Link>
                </div>

                <div className="my-1 h-px bg-border/20" />

                {/* Dropdown Options */}
                <div className="space-y-0.5">
                  <Link
                    href="/user/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/user/my_blogs"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <FileText className="h-4 w-4" />
                    My Blogs
                  </Link>
                  <Link
                    href="/user/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </div>

                <div className="my-1 h-px bg-border/20" />

                {/* Logout Option */}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
