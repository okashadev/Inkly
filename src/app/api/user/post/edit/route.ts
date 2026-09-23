import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();

    if (!id) {
      return Response.json(
        { success: false, error: "Post ID is required." },
        { status: 400 },
      );
    }

    const post = await db.post.findFirst({
      where: {
        id,
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        description: true,
        coverImage: true,
        readingTime: true,
        published: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!post) {
      return Response.json(
        {
          success: false,
          error: "Post not found or you don't have access to edit it.",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        post,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[FETCH_SINGLE_POST_ERROR]:", error);
    return Response.json(
      { success: false, error: "Failed to fetch post details." },
      { status: 500 },
    );
  }
}
