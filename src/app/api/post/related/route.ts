import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const currentPostId = searchParams.get("currentPostId");

    if (!categoryId || !currentPostId) {
      return NextResponse.json(
        {
          success: false,
          message: "categoryId and currentPostId are required",
        },
        { status: 400 },
      );
    }

    let relatedPosts = await db.post.findMany({
      where: {
        categoryId: categoryId,
        id: { not: currentPostId },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, image: true, username: true },
        },
        category: { select: { name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (relatedPosts.length < 3) {
      const existingIds = [currentPostId, ...relatedPosts.map((p) => p.id)];
      const needed = 3 - relatedPosts.length;

      const fallbackPosts = await db.post.findMany({
        where: {
          id: { notIn: existingIds },
        },
        take: needed,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, image: true, username: true },
          },
          category: { select: { name: true } },
          _count: { select: { likes: true, comments: true } },
        },
      });

      relatedPosts = [...relatedPosts, ...fallbackPosts];
    }

    return NextResponse.json(
      { success: true, posts: relatedPosts },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("RELATED_POSTS_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
