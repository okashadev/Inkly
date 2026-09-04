"use client";

import { pusherClient } from "@/lib/pusher";
import { Bell, Heart, MessageSquare, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface NotificationListenerProps {
  userId: string;
}

export default function NotificationListener({
  userId,
}: NotificationListenerProps) {
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      return;
    }

    const channelName = `user-${userId}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("new-notification", (data: any) => {
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
        description: description,
        icon: icon,
        action: data.postId
          ? {
              label: "View",
              onClick: () => router.push(`/user/notification`),
            }
          : undefined,
      });

      router.refresh();
    });

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [userId, router]);

  return null;
}
