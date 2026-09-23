import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const skip = (page - 1) * limit;

    const [savedBlogs, totalSaved] = await Promise.all([
      db.savedPost.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip,
        select: {
          id: true,
          createdAt: true,
          post: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              category: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
          },
        },
      }),
      db.savedPost.count({ where: { userId } }),
    ]);

    return Response.json(
      {
        success: true,
        savedBlogs,
        pagination: {
          total: totalSaved,
          page,
          limit,
          totalPages: Math.ceil(totalSaved / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SAVED_BLOGS_GET_ERROR]:", error);
    return Response.json(
      { success: false, error: "Failed to load saved blogs." },
      { status: 500 }
    );
  }
}