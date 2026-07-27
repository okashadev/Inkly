import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required." },
        { status: 400 },
      );
    }

    const post = await db.post.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            _count: {
              select: {
                followers: true,
                posts: true,
              },
            },
          },
        },
        category: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found." },
        { status: 404 },
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
