import { type NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return Response.json(
        {
          success: true,
          count: 0,
          data: [],
        },
        { status: 200 },
      );
    }

    const results = await db.post.findMany({
      where: {
        published: true,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      take: 20,
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
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(
      {
        success: true,
        count: results.length,
        data: results,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET_SEARCH_BLOGS_ERROR]:", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong fetching search results",
      },
      { status: 500 },
    );
  }
}
