"use client";

import { pusherClient } from "@/lib/pusher";
import { Bell, Heart, MessageSquare, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface NotificationData {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW" | string;
  senderName: string;
  senderImage?: string;
  postId?: string;
}

interface NotificationListenerProps {
  userId: string;
}

export default function NotificationListener({
  userId,
}: NotificationListenerProps) {
  const router = useRouter();

  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const channelName = `user-${userId}`;
    const channel = pusherClient.subscribe(channelName);

    const handleNewNotification = (data: NotificationData) => {
      let title = "New Notification";
      let description = "";
      let icon = <Bell className="w-5 h-5 text-emerald-500" />;

      if (data.type === "LIKE") {
        title = "New Like";
        description = `${data.senderName} liked your post.`;
        icon = <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />;
      } else if (data.type === "COMMENT") {
        title = "New Comment";
        description = `${data.senderName} commented on your post.`;
        icon = <MessageSquare className="w-5 h-5 text-blue-500" />;
      } else if (data.type === "FOLLOW") {
        title = "New Follower";
        description = `${data.senderName} started following you.`;
        icon = <UserPlus className="w-5 h-5 text-emerald-500" />;
      }

      toast(title, {
        description,
        icon,
        action: data.postId
          ? {
              label: "View",
              onClick: () => routerRef.current.push("/user/notification"),
            }
          : undefined,
      });

      routerRef.current.refresh();
    };

    channel.bind("new-notification", handleNewNotification);

    return () => {
      channel.unbind("new-notification", handleNewNotification);
      pusherClient.unsubscribe(channelName);
    };
  }, [userId]);

  return null;
}
