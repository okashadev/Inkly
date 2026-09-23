import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized Access!" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const skip = (page - 1) * limit;

    const [userComments, totalComments] = await Promise.all([
      db.comment.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip,
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          post: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              description: true,
            },
          },
        },
      }),
      db.comment.count({ where: { authorId: userId } }),
    ]);

    return Response.json(
      {
        success: true,
        userComments,
        pagination: {
          total: totalComments,
          page,
          limit,
          totalPages: Math.ceil(totalComments / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET_USER_COMMENTS_ERROR]:", error);
    return Response.json(
      { success: false, error: "Failed to load comments." },
      { status: 500 }
    );
  }
}