import { type NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug")?.trim();

    if (!slug) {
      return Response.json(
        { success: false, error: "Category slug is required." },
        { status: 400 },
      );
    }

    const blogs = await db.post.findMany({
      where: {
        published: true,
        category: {
          slug: slug,
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        createdAt: true,
        views: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
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

    return Response.json(
      {
        success: true,
        blogs,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET_BLOGS_BY_CATEGORY_ERROR]:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch blogs for this category.",
      },
      { status: 500 },
    );
  }
}
