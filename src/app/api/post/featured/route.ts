import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const featuredPosts = await db.post.findMany({
      where: {
        published: true,
      },
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

    let userSavedPostIds: string[] = [];

    if (userId) {
      const savedPosts = await db.savedPost.findMany({
        where: { userId },
        select: { postId: true },
      });
      userSavedPostIds = savedPosts.map((sp) => sp.postId);
    }

    return NextResponse.json(
      {
        success: true,
        savedPostIds: userSavedPostIds,
        posts: featuredPosts,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("FEATURED_POSTS_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
