import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized access",
        },
        { status: 401 },
      );
    }

    const userId = session?.user?.id;
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";

    const whereCondition: any = {
      authorId: userId,
    };

    if (status === "published") {
      whereCondition.published = true;
    } else if (status === "draft") {
      whereCondition.published = false;
    }

    if (search.trim() !== "") {
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
          include: {
            category: {
              select: { id: true, name: true, slug: true },
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

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalBlogs: totalBlogsCount,
          draftsCount: draftCount,
          totalViews: aggregateViews._sum.views || 0,
        },
        posts: posts,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("My Blogs API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load user blogs" },
      { status: 500 },
    );
  }
}
