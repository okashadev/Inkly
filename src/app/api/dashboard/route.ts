import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized access.",
        },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const [userData, totalPostsCount, aggregatedViews, totalLikesCount] =
      await Promise.all([
        db.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            _count: {
              select: {
                followers: true,
              },
            },
            posts: {
              orderBy: {
                createdAt: "desc",
              },
              take: 3,
              select: {
                id: true,
                title: true,
                description: true,
                published: true,
                createdAt: true,
                coverImage: true,
                views: true,
                _count: {
                  select: {
                    likes: true,
                  },
                },
              },
            },
          },
        }),

        db.post.count({
          where: { authorId: userId },
        }),

        db.post.aggregate({
          where: { authorId: userId },
          _sum: {
            views: true,
          },
        }),

        db.like.count({
          where: {
            post: {
              authorId: userId,
            },
          },
        }),
      ]);

    if (!userData) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    const statsData = {
      totalPosts: totalPostsCount,
      totalViews: aggregatedViews._sum.views || 0,
      totalLikes: totalLikesCount,
      totalFollowers: userData._count.followers || 0,
    };

    return Response.json(
      {
        success: true,
        data: {
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            image: userData.image,
          },
          stats: statsData,
          recentPosts: userData.posts,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET_USER_DASHBOARD_DATA_ERROR]:", error);
    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
