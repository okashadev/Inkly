"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { User } from "@/types/user";

interface DashboardShellProps {
  user: User | null;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <TopNav user={user} onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Main Page Workspace */}
      <div className="transition-all">{children}</div>
    </div>
  );
}