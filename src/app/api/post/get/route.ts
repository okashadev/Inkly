import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id")?.trim();

    if (!postId) {
      return Response.json(
        { success: false, error: "Post ID is required." },
        { status: 400 },
      );
    }

    const session = await auth();
    const currentUserId = session?.user?.id;

    const post = await db.post.findUnique({
      where: {
        id: postId,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
            _count: {
              select: {
                followers: true,
                posts: true,
              },
            },
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
      },
    });

    if (!post) {
      return Response.json(
        { success: false, error: "Post not found or unpublished." },
        { status: 404 },
      );
    }

    let isFollowing = false;
    let isLiked = false;
    let isSaved = false;

    if (currentUserId) {
      const [followRecord, likeRecord, savedRecord] = await Promise.all([
        post.author?.id
          ? db.follow.findUnique({
              where: {
                followerId_followingId: {
                  followerId: currentUserId,
                  followingId: post.author.id,
                },
              },
              select: { id: true },
            })
          : null,

        db.like.findUnique({
          where: {
            userId_postId: {
              userId: currentUserId,
              postId: post.id,
            },
          },
          select: { id: true },
        }),

        db.savedPost.findUnique({
          where: {
            userId_postId: {
              userId: currentUserId,
              postId: post.id,
            },
          },
          select: { id: true },
        }),
      ]);

      isFollowing = !!followRecord;
      isLiked = !!likeRecord;
      isSaved = !!savedRecord;
    }

    return Response.json(
      {
        success: true,
        post,
        userState: {
          isFollowing,
          isLiked,
          isSaved,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[FETCH_POST_DETAILS_ERROR]:", error);
    return Response.json(
      {
        success: false,
        error: "Internal Server Error: Failed to fetch post details.",
      },
      { status: 500 },
    );
  }
}
