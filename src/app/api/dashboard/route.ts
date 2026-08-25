import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized access.",
        },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const userData = await db.user.findUnique({
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
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    const [totalPostsCount, aggregatedStats] = await Promise.all([
      db.post.count({
        where: { authorId: userId },
      }),
      db.post.aggregate({
        where: { authorId: userId },
        _sum: {
          views: true,
        },
      }),
    ]);

    const totalLikes = userData.posts.reduce(
      (acc, post) => acc + post._count.likes,
      0,
    );

    const statsData = {
      totalPosts: totalPostsCount,
      totalViews: aggregatedStats._sum.views || 0,
      totalLikes: totalLikes,
      totalFollowers: userData._count.followers || 0,
    };

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error("GET USER DATA :", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
