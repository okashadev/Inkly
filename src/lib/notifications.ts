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
    if (senderId === receiverId) return;

    const notification = await db.notification.create({
      data: {
        type,
        senderId,
        receiverId,
        postId,
        commentId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    const channelName = `user-${receiverId}`;
    await pusherServer.trigger(channelName, "new-notification", {
      id: notification.id,
      type: notification.type,
      postId: notification.postId,
      senderName:
        notification.sender.name || notification.sender.username || "Someone",
      senderImage: notification.sender.image,
    });

    return notification;
  } catch (error) {
    console.error("[CREATE_NOTIFICATION_ERROR]:", error);
  }
}
