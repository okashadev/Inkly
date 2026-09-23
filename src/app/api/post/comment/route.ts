import { type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CreateNotification } from "@/lib/notifications";

const createCommentSchema = z.object({
  postId: z.string().trim().min(1, "Post ID is required."),
  content: z
    .string()
    .trim()
    .min(1, "Comment content cannot be empty.")
    .max(1000, "Comment cannot exceed 1000 characters."),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId")?.trim();

    if (!postId) {
      return Response.json(
        { success: false, error: "Post ID is required." },
        { status: 400 },
      );
    }

    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const rawLimit = parseInt(searchParams.get("limit") || "20", 10);

    const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit =
      !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 50 ? rawLimit : 20;
    const skip = (page - 1) * limit;

    const [comments, totalComments] = await Promise.all([
      db.comment.findMany({
        where: { postId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      }),

      db.comment.count({
        where: { postId },
      }),
    ]);

    const totalPages = Math.ceil(totalComments / limit) || 1;

    return Response.json(
      {
        success: true,
        data: {
          comments,
          pagination: {
            page,
            limit,
            totalComments,
            totalPages,
            hasNextPage: page < totalPages,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET_COMMENTS_ERROR]:", error);
    return Response.json(
      { success: false, error: "Failed to fetch comments." },
      { status: 500 },
    );
  }
}

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
        { success: false, error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const parseResult = createCommentSchema.safeParse(body);

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

    const { postId, content } = parseResult.data;

    const postExists = await db.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });

    if (!postExists) {
      return Response.json(
        { success: false, error: "Post not found." },
        { status: 404 },
      );
    }

    const newComment = await db.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    if (postExists.authorId !== userId) {
      CreateNotification({
        type: "COMMENT",
        senderId: userId,
        receiverId: postExists.authorId,
        postId,
        commentId: newComment.id,
      }).catch((err) => {
        console.error("Failed to trigger comment notification:", err);
      });
    }

    const commentsCount = await db.comment.count({
      where: { postId },
    });

    return Response.json(
      {
        success: true,
        message: "Comment added successfully.",
        comment: newComment,
        commentsCount,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST_COMMENT_ERROR]:", error);
    return Response.json(
      { success: false, error: "Failed to post comment." },
      { status: 500 },
    );
  }
}
