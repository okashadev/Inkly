import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim() || "";

    const whereCondition: Prisma.PostWhereInput = {
      authorId: userId,
    };

    if (status === "published") {
      whereCondition.published = true;
    } else if (status === "draft") {
      whereCondition.published = false;
    }

    if (search !== "") {
      whereCondition.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, totalBlogsCount, draftCount, aggregateViews] =
      await Promise.all([
        db.post.findMany({
          where: whereCondition,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            coverImage: true,
            published: true,
            views: true,
            createdAt: true,
            updatedAt: true,
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
        }),
        db.post.count({ where: { authorId: userId } }),
        db.post.count({ where: { authorId: userId, published: false } }),
        db.post.aggregate({
          where: { authorId: userId },
          _sum: { views: true },
        }),
      ]);

    const publishedCount = totalBlogsCount - draftCount;

    return Response.json(
      {
        success: true,
        stats: {
          totalBlogs: totalBlogsCount,
          publishedCount,
          draftsCount: draftCount,
          totalViews: aggregateViews._sum.views || 0,
        },
        posts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[MY_BLOGS_GET_ERROR]:", error);
    return Response.json(
      { success: false, error: "Failed to load user blogs." },
      { status: 500 },
    );
  }
}
