import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const featuredPosts = await db.post.findMany({
      take: 3,
      orderBy: [
        {
          likes: {
            _count: "desc",
          },
        },
        {
          comments: {
            _count: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
      include: {
        author: {
          select: { id: true, name: true, image: true, username: true },
        },
        category: {
          select: { name: true },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json(
      { success: true, posts: featuredPosts },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("FEATURED_POSTS_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}