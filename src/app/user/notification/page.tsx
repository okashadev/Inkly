"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Heart,
  MessageSquare,
  UserPlus,
  Bell,
  Loader2,
  CheckCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useSession } from "next-auth/react";
import { User } from "@/types/user";
import Spinner from "@/components/home/Spinner";
import { formatTimeAgo } from "@/utils/formatTime";

interface NotificationSender {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

interface NotificationItem {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW";
  read: boolean;
  postId?: string | null;
  createdAt: string;
  sender: NotificationSender;
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalNotifications: number;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { data: session, status } = useSession();

  const user = session?.user as User;

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [markingAll, setMarkingAll] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function initNotifications() {
      try {
        setLoading(true);
        const res = await fetch("/api/user/notifications?page=1&limit=10");
        const resData = await res.json();

        if (isMounted && resData.success) {
          setNotifications(resData.data.notifications);
          setPagination(resData.data.pagination);
          setUnreadCount(resData.data.unreadCount);
        }
      } catch (error) {
        console.error("[NOTIFICATIONS_INIT_ERROR]:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const markAsRead = useCallback(
    async (id: string, isAlreadyRead: boolean) => {
      if (isAlreadyRead) return;

      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await fetch("/api/user/notifications/read", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId: id }),
        });
      } catch (error) {
        console.error("[MARK_SINGLE_READ_ERROR]:", error);
      }
    },
    []
  );

  const handleLoadMore = async () => {
    if (!pagination || pagination.page >= pagination.totalPages || loadingMore) {
      return;
    }

    try {
      setLoadingMore(true);
      const nextPage = pagination.page + 1;

      const res = await fetch(
        `/api/user/notifications?page=${nextPage}&limit=${pagination.limit}`
      );
      const json = await res.json();

      if (json.success) {
        setNotifications((prev) => [...prev, ...json.data.notifications]);
        setPagination(json.data.pagination);
      }
    } catch (error) {
      console.error("[LOAD_MORE_NOTIFICATIONS_ERROR]:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || markingAll) return;

    try {
      setMarkingAll(true);

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, read: true }))
      );
      setUnreadCount(0);

      await fetch("/api/user/notifications/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
    } catch (error) {
      console.error("[MARK_ALL_READ_ERROR]:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-xl font-bold text-white font-manrope flex justify-center items-center gap-4">
          <Spinner />
          <span>Inkly</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell user={user}>
      <div className="md:ml-64 pt-26 px-8 pb-12 min-h-screen bg-[#0F172A] text-white relative">

        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            {pagination && (
              <p className="text-xs text-zinc-500 mt-0.5">
                Showing {notifications.length} of{" "}
                {pagination.totalNotifications}
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-800 rounded-xl">
            <Bell className="w-10 h-10 text-zinc-600 mb-3" />
            <p className="text-sm font-medium text-zinc-400">
              No notifications yet
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              When people like, comment, or follow you, you'll see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const senderName =
                notif.sender.name || notif.sender.username || "Someone";
              const profileUrl = `/authors/profile/${notif.sender.id}`;

              return (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id, notif.read)}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    !notif.read
                      ? "bg-zinc-900/90 border-emerald-500/30 shadow-sm"
                      : "bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Link
                      href={profileUrl}
                      onClick={() => markAsRead(notif.id, notif.read)}
                      className="relative shrink-0 group"
                    >
                      {notif.sender.image ? (
                        <Image
                          src={notif.sender.image}
                          alt={senderName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover group-hover:ring-2 ring-emerald-500 transition-all"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-semibold text-zinc-300 group-hover:ring-2 ring-emerald-500 transition-all">
                          {senderName[0]?.toUpperCase()}
                        </div>
                      )}

                      <div className="absolute -bottom-1 -right-1 p-1 bg-zinc-950 rounded-full">
                        {notif.type === "LIKE" && (
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" />
                        )}
                        {notif.type === "COMMENT" && (
                          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        {notif.type === "FOLLOW" && (
                          <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                    </Link>

                    <div className="text-sm min-w-0">
                      <p className="text-zinc-200 leading-snug">
                        <Link
                          href={profileUrl}
                          onClick={() => markAsRead(notif.id, notif.read)}
                          className="font-semibold text-white hover:text-emerald-400 hover:underline transition-colors"
                        >
                          {senderName}
                        </Link>{" "}
                        {notif.type === "LIKE" && "liked your post."}
                        {notif.type === "COMMENT" && "commented on your post."}
                        {notif.type === "FOLLOW" && "started following you."}
                      </p>

                      <span className="text-[11px] text-zinc-500 block mt-0.5">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}

                    {notif.postId && (
                      <Link
                        href={`/blog/${notif.postId}`}
                        onClick={() => markAsRead(notif.id, notif.read)}
                        className="px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
                      >
                        View Post
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

            {pagination && pagination.page < pagination.totalPages && (
              <div className="pt-6 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-sm font-medium text-zinc-200 rounded-lg transition-all inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                      Loading...
                    </>
                  ) : (
                    "Load More Notifications"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}