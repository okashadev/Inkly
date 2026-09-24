import { type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const savePostSchema = z.object({
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

    const parseResult = savePostSchema.safeParse(body);

    if (!parseResult.success) {
      return Response.json(
        {
          success: false,
          error: "Validation failed.",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { postId } = parseResult.data;

    const postExists = await db.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) {
      return Response.json(
        { success: false, error: "Post not found." },
        { status: 404 },
      );
    }

    const isSaved = await db.$transaction(async (tx) => {
      const existingSave = await tx.savedPost.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        select: { id: true },
      });

      if (existingSave) {
        await tx.savedPost.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
        return false;
      } else {
        await tx.savedPost.create({
          data: {
            userId,
            postId,
          },
        });
        return true;
      }
    });

    return Response.json(
      {
        success: true,
        isSaved,
        message: isSaved
          ? "Blog saved successfully!"
          : "Blog removed from saved list.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[SAVE_POST_API_ERROR]:", error);
    return Response.json(
      {
        success: false,
        error: "Internal Server Error: Failed to update bookmark status.",
      },
      { status: 500 },
    );
  }
}
