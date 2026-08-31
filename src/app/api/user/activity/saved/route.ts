import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized access",
        },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const savedBlogs = await db.savedPost.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            authorId: true,
            coverImage: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        savedBlogs,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error Fetching Saved Blogs: ", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load saved blogs.",
      },
      { status: 500 },
    );
  }
}
