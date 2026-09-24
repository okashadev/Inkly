import { type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CreateNotification } from "@/lib/notifications";

const likeToggleSchema = z.object({
  postId: z.string().trim().min(1, "Post ID is required."),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    let body = {};
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400 },
      );
    }

    const parseResult = likeToggleSchema.safeParse(body);

    if (!parseResult.success) {
      return Response.json(
        {
          success: false,
          error: "Validation failed.",
          details: parseResult.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const { postId } = parseResult.data;

    const post = await db.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return Response.json(
        { success: false, error: "Post not found." },
        { status: 404 },
      );
    }

    const { isLiked, totalLikes } = await db.$transaction(async (tx) => {
      const existingLike = await tx.like.findFirst({
        where: {
          postId,
          userId,
        },
        select: { id: true },
      });

      let currentlyLiked = false;

      if (existingLike) {
        await tx.like.delete({
          where: { id: existingLike.id },
        });
        currentlyLiked = false;
      } else {
        await tx.like.create({
          data: {
            postId,
            userId,
          },
        });
        currentlyLiked = true;
      }

      const likesCount = await tx.like.count({
        where: { postId },
      });

      return { isLiked: currentlyLiked, totalLikes: likesCount };
    });

    if (isLiked) {
      if (post.authorId !== userId) {
        CreateNotification({
          type: "LIKE",
          senderId: userId,
          receiverId: post.authorId,
          postId,
        }).catch((err) => {
          console.error("Failed to trigger like notification:", err);
        });
      }
    } else {
      db.notification
        .deleteMany({
          where: {
            type: "LIKE",
            senderId: userId,
            receiverId: post.authorId,
            postId,
          },
        })
        .catch((err) => {
          console.error("Failed to remove like notification on unlike:", err);
        });
    }

    return Response.json(
      {
        success: true,
        message: isLiked ? "Post liked." : "Post unliked.",
        isLiked,
        likesCount: totalLikes,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[LIKE_TOGGLE_API_ERROR]:", error);
    return Response.json(
      {
        success: false,
        error: "Internal Server Error: Failed to process like operation.",
      },
      { status: 500 },
    );
  }
}
