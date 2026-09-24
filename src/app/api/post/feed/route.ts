import { type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const feedSchema = z.object({
  limit: z.number().int().min(1).max(50).default(6),
  excludeIds: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    let body = {};
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400 },
      );
    }

    const parseResult = feedSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid request payload.",
          details: parseResult.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const { limit, excludeIds } = parseResult.data;

    const postSelectFields = {
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

    let posts: Array<any> = [];

    if (!userId) {
      posts = await db.post.findMany({
        where: {
          published: true,
          id: { notIn: excludeIds },
        },
        take: limit,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: postSelectFields,
      });
    } else {
      const following = await db.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingIds = following.map((f) => f.followingId);
      const halfLimit = Math.ceil(limit / 2);

      let followedPosts: Array<any> = [];

      if (followingIds.length > 0) {
        followedPosts = await db.post.findMany({
          where: {
            published: true,
            authorId: { in: followingIds },
            id: { notIn: excludeIds },
          },
          take: halfLimit,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          select: postSelectFields,
        });
      }

      const currentExclude = [...excludeIds, ...followedPosts.map((p) => p.id)];
      const remainingTake = limit - followedPosts.length;

      let globalPosts: Array<any> = [];
      if (remainingTake > 0) {
        globalPosts = await db.post.findMany({
          where: {
            published: true,
            id: { notIn: currentExclude },
          },
          take: remainingTake,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          select: postSelectFields,
        });
      }

      posts = [...followedPosts, ...globalPosts];
    }

    if (posts.length === 0) {
      return Response.json(
        {
          success: true,
          posts: [],
          hasMore: false,
        },
        { status: 200 },
      );
    }

    const fetchedPostIds = posts.map((p) => p.id);

    const [savedPosts, totalRemainingCount] = await Promise.all([
      userId
        ? db.savedPost.findMany({
            where: {
              userId,
              postId: { in: fetchedPostIds },
            },
            select: { postId: true },
          })
        : [],

      db.post.count({
        where: {
          published: true,
          id: { notIn: [...excludeIds, ...fetchedPostIds] },
        },
      }),
    ]);

    const savedPostIdsSet = new Set(savedPosts.map((sp) => sp.postId));

    const enrichedPosts = posts.map((post) => ({
      ...post,
      isSaved: savedPostIdsSet.has(post.id),
    }));

    return Response.json(
      {
        success: true,
        posts: enrichedPosts,
        hasMore: totalRemainingCount > 0,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[HYBRID_FEED_ERROR]:", error);
    return Response.json(
      {
        success: false,
        error: "Internal Server Error: Failed to fetch feed posts.",
      },
      { status: 500 },
    );
  }
}
