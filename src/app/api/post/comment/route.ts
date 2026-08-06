import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 },
      );
    }

    const comments = await db.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, image: true, username: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        comments,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET Comments Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const { postId, content } = await req.json();

    if (!postId || !content || content.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Post ID and comment content are required" },
        { status: 400 },
      );
    }

    const postExists = await db.post.findUnique({
      where: { id: postId },
    });

    if (!postExists) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    const newComment = await db.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
      },
    });

    const totalComments = await db.comment.count({
      where: { postId },
    });

    return NextResponse.json({
      success: true,
      comment: newComment,
      commentsCount: totalComments,
    });
  } catch (error: any) {
    console.error("POST Comment Error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong while posting comment" },
      { status: 500 },
    );
  }
}
