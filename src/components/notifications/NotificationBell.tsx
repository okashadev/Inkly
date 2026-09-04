"use client";

import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { Bell } from "lucide-react";
import Link from "next/link";

interface NotificationBellProps {
  userId: string;
  initialUnreadCount: number;
}

export function NotificationBell({ userId, initialUnreadCount }: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  useEffect(() => {
    if (!userId) return;

    const channelName = `user-${userId}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("new-notification", () => {
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [userId]);

  return (
    <Link
      href="/user/notification"
      className="relative p-2.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
    >
      <Bell className="w-5 h-5" />
      
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 min-w-4.5 h-4.5 px-1 bg-emerald-500 text-black font-extrabold text-[10px] rounded-full flex items-center justify-center animate-in zoom-in">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}