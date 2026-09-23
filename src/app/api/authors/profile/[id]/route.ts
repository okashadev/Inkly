import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { success: false, error: "Author ID is required" },
        { status: 400 },
      );
    }

    const session = await auth();
    const currentUserId = session?.user?.id;

    const author = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        createdAt: true,
        posts: {
          where: {
            published: true,
          },
          select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
            createdAt: true,
            views: true,
            category: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                likes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            posts: {
              where: {
                published: true,
              },
            },
            followers: true,
            following: true,
          },
        },
        ...(currentUserId && {
          followers: {
            where: {
              followerId: currentUserId,
            },
            select: {
              followerId: true,
            },
            take: 1,
          },
          following: {
            where: {
              followingId: currentUserId,
            },
            select: {
              followingId: true,
            },
            take: 1,
          },
        }),
      },
    });

    if (!author) {
      return Response.json(
        { success: false, error: "Author not found" },
        { status: 404 },
      );
    }

    const isFollowing = Boolean(
      author.followers && author.followers.length > 0,
    );
    const isFollower = Boolean(author.following && author.following.length > 0);

    const { followers, following, ...authorData } = author;

    return Response.json(
      {
        success: true,
        author: authorData,
        isFollowing,
        isFollower,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET_AUTHOR_PROFILE_ERROR]:", error);
    return Response.json(
      { success: false, error: "Failed to fetch author profile" },
      { status: 500 },
    );
  }
}
