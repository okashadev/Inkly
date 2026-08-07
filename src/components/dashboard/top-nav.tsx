"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Search, Bell } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

export function TopNav({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="fixed left-0 right-0 top-0 z-30 flex h-25 items-center justify-between border-b border-border/30 bg-background/70 px-6 backdrop-blur-xl md:left-64 md:px-12">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tighter text-primary md:hidden">
          Inkly
        </Link>
        <nav className="hidden md:flex flex-col" aria-label="Primary">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Dashboard
          </h2>
          <h3 className="text-balance font-display text-2xl font-extrabold tracking-tighter text-foreground">
            Welcome back, {user.name || "User"}
          </h3>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background"
            aria-hidden="true"
          />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-10 w-10 overflow-hidden rounded-full cursor-pointer focus:outline-none ring-2 ring-transparent hover:ring-primary/50 transition-all active:scale-95"
            aria-label="Open profile menu"
          >
            <Image
              src={user?.image || "/images/userImage.webp"}
              alt="Alex's avatar"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 4, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#171f33] border border-border/30 p-2 shadow-2xl z-50 text-[#dae2fd]"
              >
                {/* Header / Label */}
                <div className="px-3 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {user?.name}
                </div>
                <p className="px-3 text-xs text-muted-foreground lowercase">{user?.email}</p>

                <div className="my-1.5 h-px bg-border/20" />

                {/* Links Group */}
                <div className="space-y-0.5">
                  <Link
                    href="/user/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center px-3 py-2 text-sm rounded-xl hover:bg-accent/50 hover:text-primary transition-colors cursor-pointer"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/user/my_blogs"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center px-3 py-2 text-sm rounded-xl hover:bg-accent/50 hover:text-primary transition-colors cursor-pointer"
                  >
                    My Blogs
                  </Link>
                  <Link
                    href="/user/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center px-3 py-2 text-sm rounded-xl hover:bg-accent/50 hover:text-primary transition-colors cursor-pointer"
                  >
                    Settings
                  </Link>
                </div>

                {/* Separator Line */}
                <div className="my-1.5 h-px bg-border/20" />

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center px-3 py-2 text-sm text-red-400 rounded-xl hover:bg-red-500/10 focus:bg-red-500/10 transition-colors cursor-pointer text-left font-medium"
                >
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
