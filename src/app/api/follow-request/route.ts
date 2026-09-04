import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CreateNotification } from "@/lib/notifications";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in first." },
        { status: 401 },
      );
    }

    const followerId = session.user.id;
    const { authorId } = await req.json();

    if (!authorId) {
      return NextResponse.json(
        { success: false, error: "Author ID is required." },
        { status: 400 },
      );
    }

    if (followerId === authorId) {
      return NextResponse.json(
        { success: false, error: "You cannot follow yourself." },
        { status: 400 },
      );
    }

    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: authorId,
        },
      },
    });

    if (existingFollow) {
      await db.follow.delete({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: authorId,
          },
        },
      });

      await db.notification.deleteMany({
        where: {
          type: "FOLLOW",
          senderId: followerId,
          receiverId: authorId,
        },
      });

      return NextResponse.json(
        {
          success: true,
          isFollowing: false,
          message: "Unfollowed successfully.",
        },
        { status: 200 },
      );
    } else {
      await db.follow.create({
        data: {
          followerId: followerId,
          followingId: authorId,
        },
      });

      await CreateNotification({
        type: "FOLLOW",
        senderId: followerId,
        receiverId: authorId,
      });

      return NextResponse.json(
        {
          success: true,
          isFollowing: true,
          message: "Followed successfully.",
        },
        { status: 200 },
      );
    }
  } catch (error: any) {
    console.error("Error handling follow request:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process follow request.",
      },
      { status: 500 },
    );
  }
}
