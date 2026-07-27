import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required." },
        { status: 400 },
      );
    }

    const post = await db.post.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found." },
        { status: 404 },
      );
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "You are not authorized to edit this post." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        post,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Fetch Post Details Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch post details.",
      },
      { status: 500 },
    );
  }
}
