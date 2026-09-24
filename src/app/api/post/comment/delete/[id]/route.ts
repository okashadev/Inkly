import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const resolvedParams = await params;
    const commentId = resolvedParams.id?.trim();

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: "Comment ID is required." },
        { status: 400 },
      );
    }

    const comment = await db.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        authorId: true,
        postId: true,
        post: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found." },
        { status: 404 },
      );
    }

    const isCommentAuthor = comment.authorId === userId;
    const isPostOwner = comment.post?.authorId === userId;

    if (!isCommentAuthor && !isPostOwner) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You are not authorized to delete this comment.",
        },
        { status: 403 },
      );
    }

    await db.comment.delete({
      where: { id: commentId },
    });

    const remainingCommentsCount = await db.comment.count({
      where: { postId: comment.postId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comment deleted successfully.",
        commentsCount: remainingCommentsCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DELETE_COMMENT_ERROR]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error: Failed to delete comment.",
      },
      { status: 500 },
    );
  }
}
