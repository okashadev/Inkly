import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

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

    const session = await auth();
    const currentUserId = session?.user?.id;

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
        comments: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found." },
        { status: 404 },
      );
    }

    let isFollowing = false;
    let isLiked = false;
    let isSaved = false;

    if (currentUserId && post.author?.id) {
      const followRecord = await db.follow.findFirst({
        where: {
          followerId: currentUserId,
          followingId: post.author.id,
        },
      });

      isFollowing = !!followRecord;
    }

    if (currentUserId && post.author?.id) {
      const likesRecord = await db.like.findFirst({
        where: {
          userId: currentUserId,
          postId: post.id,
        },
      });

      isLiked = !!likesRecord;
    }

    if (currentUserId && post.author?.id) {
      const savedRecord = await db.savedPost.findFirst({
        where: {
          userId: currentUserId,
          postId: post.id,
        },
      });

      isSaved = !!savedRecord;
    }

    return NextResponse.json(
      {
        success: true,
        post,
        isFollowing,
        isLiked,
        isSaved,
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
