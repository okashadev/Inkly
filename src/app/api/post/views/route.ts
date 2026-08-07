import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 },
      );
    }

    const post = await db.post.findUnique({
      where: { id: postId },
      select: { authorId: true, views: true },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    if (session?.user?.id && session.user.id === post.authorId) {
      return NextResponse.json({
        success: true,
        views: post.views,
        message: "Author view skipped",
      });
    }

    const updatedPost = await db.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
      select: { id: true, views: true },
    });

    return NextResponse.json(
      {
        success: true,
        views: updatedPost.views,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Increment Views Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to increment post views" },
      { status: 500 },
    );
  }
}
