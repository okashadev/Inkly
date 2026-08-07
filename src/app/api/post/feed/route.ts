import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const featuredPost = await db.post.findFirst({
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
      ],
      include: {
        author: {
          select: { id: true, name: true, image: true, username: true },
        },
        category: {
          select: {
            name: true,
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    const excludeIds: string[] = featuredPost ? [featuredPost.id] : [];

    if (!userId) {
      const publicPosts = await db.post.findMany({
        where: {
          id: { notIn: excludeIds },
        },
        take: 10,
        orderBy: [{ createdAt: "desc" }],
        include: {
          author: {
            select: { id: true, name: true, image: true, username: true },
          },
          category: {
            select: {
              name: true,
            },
          },
          _count: { select: { likes: true, comments: true } },
        },
      });
      return NextResponse.json(
        { success: true, featuredPost, posts: publicPosts },
        { status: 200 },
      );
    }

    const following = await db.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    let followedPosts: any[] = [];
    if (followingIds.length > 0) {
      followedPosts = await db.post.findMany({
        where: {
          id: { notIn: excludeIds },
          authorId: { in: followingIds },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, image: true, username: true },
          },
          category: {
            select: {
              name: true,
            },
          },
          _count: { select: { likes: true, comments: true } },
        },
      });
    }

    excludeIds.push(...followedPosts.map((p) => p.id));

    const engagementPosts = await db.post.findMany({
      where: {
        id: { notIn: excludeIds },
        authorId: { not: userId },
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
      ],
      include: {
        author: {
          select: { id: true, name: true, image: true, username: true },
        },
        category: {
          select: {
            name: true,
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    excludeIds.push(...engagementPosts.map((p) => p.id));

    const remainingCount = 10 - (followedPosts.length + engagementPosts.length);

    const randomPosts = await db.post.findMany({
      where: {
        id: { notIn: excludeIds },
      },
      take: Math.max(remainingCount, 3),
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, image: true, username: true },
        },
        category: {
          select: {
            name: true,
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    const hybridFeed = interleavePosts(
      followedPosts,
      engagementPosts,
      randomPosts,
    );

    return NextResponse.json(
      {
        success: true,
        featuredPost,
        posts: hybridFeed,
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

function interleavePosts(followed: any[], engagement: any[], random: any[]) {
  const result = [];
  const maxLength = Math.max(followed.length, engagement.length, random.length);

  for (let i = 0; i < maxLength; i++) {
    if (followed[i]) result.push(followed[i]);
    if (engagement[i]) result.push(engagement[i]);
    if (random[i]) result.push(random[i]);
  }

  return result;
}
