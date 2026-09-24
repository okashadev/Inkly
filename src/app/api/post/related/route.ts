import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId")?.trim();
    const currentPostId = searchParams.get("currentPostId")?.trim();

    if (!categoryId || !currentPostId) {
      return Response.json(
        {
          success: false,
          error:
            "Both categoryId and currentPostId query parameters are required.",
        },
        { status: 400 },
      );
    }

    const session = await auth();
    const userId = session?.user?.id;

    const selectPostFields = {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    } as const;

    let relatedPosts = await db.post.findMany({
      where: {
        categoryId,
        id: { not: currentPostId },
        published: true,
      },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: selectPostFields,
    });

    if (relatedPosts.length < 3) {
      const existingIds = [currentPostId, ...relatedPosts.map((p) => p.id)];
      const needed = 3 - relatedPosts.length;

      const fallbackPosts = await db.post.findMany({
        where: {
          id: { notIn: existingIds },
          published: true,
        },
        take: needed,
        orderBy: { createdAt: "desc" },
        select: selectPostFields,
      });

      relatedPosts = [...relatedPosts, ...fallbackPosts];
    }

    if (relatedPosts.length === 0) {
      return Response.json({ success: true, posts: [] }, { status: 200 });
    }

    const postIds = relatedPosts.map((p) => p.id);
    let savedSet = new Set<string>();

    if (userId) {
      const savedPosts = await db.savedPost.findMany({
        where: {
          userId,
          postId: { in: postIds },
        },
        select: { postId: true },
      });

      savedSet = new Set(savedPosts.map((sp) => sp.postId));
    }

    const enrichedPosts = relatedPosts.map((post) => ({
      ...post,
      isSaved: savedSet.has(post.id),
    }));

    return Response.json(
      { success: true, posts: enrichedPosts },
      { status: 200 },
    );
  } catch (error) {
    console.error("[RELATED_POSTS_ERROR]:", error);
    return Response.json(
      {
        success: false,
        error: "Internal Server Error: Failed to fetch related posts.",
      },
      { status: 500 },
    );
  }
}
