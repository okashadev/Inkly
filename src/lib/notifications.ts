import { NotificationType } from "@prisma/client";
import { db } from "./db";
import { pusherServer } from "./pusher";

interface CreateNoticationParams {
  type: NotificationType;
  senderId: string;
  receiverId: string;
  postId?: string;
  commentId?: string;
}

export async function CreateNotification({
  type,
  senderId,
  receiverId,
  postId,
  commentId,
}: CreateNoticationParams) {
  try {
    if (senderId === receiverId) return null;

    const notification = await db.notification.create({
      data: {
        type,
        senderId,
        receiverId,
        postId,
        commentId,
      },
      select: {
        id: true,
        type: true,
        postId: true,
        receiverId: true,
        sender: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    const channelName = `user-${receiverId}`;
    const senderName =
      notification.sender.name || notification.sender.username || "Someone";

    pusherServer
      .trigger(channelName, "new-notification", {
        id: notification.id,
        type: notification.type,
        postId: notification.postId,
        senderName,
        senderImage: notification.sender.image,
      })
      .catch((err) => {
        console.error("[PUSHER_TRIGGER_ERROR]:", err);
      });

    return notification;
  } catch (error) {
    console.error("[CREATE_NOTIFICATION_ERROR]:", error);
  }
}
