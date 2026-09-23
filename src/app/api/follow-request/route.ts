import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CreateNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const followerId = session.user.id;
    const body = await req.json().catch(() => ({}));
    const { authorId } = body;

    if (!authorId || typeof authorId !== "string") {
      return Response.json(
        { success: false, error: "Valid Author ID is required." },
        { status: 400 }
      );
    }

    if (followerId === authorId) {
      return Response.json(
        { success: false, error: "You cannot follow yourself." },
        { status: 400 }
      );
    }

    const targetAuthor = await db.user.findUnique({
      where: { id: authorId },
      select: { id: true },
    });

    if (!targetAuthor) {
      return Response.json(
        { success: false, error: "Author not found." },
        { status: 404 }
      );
    }

    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: authorId,
        },
      },
    });

    if (existingFollow) {
      await db.$transaction([
        db.follow.delete({
          where: {
            followerId_followingId: {
              followerId,
              followingId: authorId,
            },
          },
        }),
        db.notification.deleteMany({
          where: {
            type: "FOLLOW",
            senderId: followerId,
            receiverId: authorId,
          },
        }),
      ]);

      return Response.json(
        {
          success: true,
          isFollowing: false,
          message: "Unfollowed successfully.",
        },
        { status: 200 }
      );
    } else {
      await db.$transaction(async (tx) => {
        await tx.follow.create({
          data: {
            followerId,
            followingId: authorId,
          },
        });
      });

      await CreateNotification({
        type: "FOLLOW",
        senderId: followerId,
        receiverId: authorId,
      });

      return Response.json(
        {
          success: true,
          isFollowing: true,
          message: "Followed successfully.",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("[TOGGLE_FOLLOW_ERROR]:", error);
    return Response.json(
      { success: false, error: "Failed to process follow request." },
      { status: 500 }
    );
  }
}