import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const limit = parseInt(body.limit || "6", 10);
    const excludeIds: string[] = Array.isArray(body.excludeIds)
      ? [...body.excludeIds]
      : [];
    const isInitialLoad = excludeIds.length === 0;

    const session = await auth();
    const userId = session?.user?.id;

    let featuredPost = null;

    if (isInitialLoad) {
      featuredPost = await db.post.findFirst({
        where: {
          published: true,
        },
        orderBy: [
          { likes: { _count: "desc" } },
          { comments: { _count: "desc" } },
        ],
        include: {
          author: {
            select: { id: true, name: true, image: true, username: true },
          },
          category: { select: { name: true } },
          _count: { select: { likes: true, comments: true } },
        },
      });

      if (featuredPost) {
        excludeIds.push(featuredPost.id);
      }
    }

    let rawPosts: any[] = [];

    if (!userId) {
      rawPosts = await db.post.findMany({
        where: {
          published: true,
          id: { notIn: excludeIds },
        },
        take: limit,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: {
          author: {
            select: { id: true, name: true, image: true, username: true },
          },
          category: { select: { name: true } },
          _count: { select: { likes: true, comments: true } },
        },
      });
    } else {
      const following = await db.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      const followingIds = following.map((f) => f.followingId);

      let followedPosts: any[] = [];
      if (followingIds.length > 0) {
        followedPosts = await db.post.findMany({
          where: {
            published: true,
            id: { notIn: excludeIds },
            authorId: { in: followingIds },
          },
          take: Math.ceil(limit / 2),
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          include: {
            author: {
              select: { id: true, name: true, image: true, username: true },
            },
            category: { select: { name: true } },
            _count: { select: { likes: true, comments: true } },
          },
        });
      }

      const currentExclude = [...excludeIds, ...followedPosts.map((p) => p.id)];
      const remainingTake = limit - followedPosts.length;

      let remainingPosts: any[] = [];
      if (remainingTake > 0) {
        remainingPosts = await db.post.findMany({
          where: {
            published: true,
            id: { notIn: currentExclude },
          },
          take: remainingTake,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          include: {
            author: {
              select: { id: true, name: true, image: true, username: true },
            },
            category: { select: { name: true } },
            _count: { select: { likes: true, comments: true } },
          },
        });
      }

      rawPosts = [...followedPosts, ...remainingPosts];
    }

    let userSavedPostIds: string[] = [];

    if (userId) {
      const savedPosts = await db.savedPost.findMany({
        where: { userId },
        select: { postId: true },
      });
      userSavedPostIds = savedPosts.map((sp) => sp.postId);
    }

    const fetchedIds = [...excludeIds, ...rawPosts.map((p) => p.id)];
    const remainingCount = await db.post.count({
      where: {
        published: true,
        id: { notIn: fetchedIds },
      },
    });

    return NextResponse.json(
      {
        success: true,
        featuredPost,
        posts: rawPosts,
        savedPostIds: userSavedPostIds,
        hasMore: remainingCount > 0,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("HYBRID_FEED_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
