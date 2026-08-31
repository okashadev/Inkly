import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized Access!",
        },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const userComments = await db.comment.findMany({
      where: {
        authorId: userId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            description: true,
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
      },
    });

    return NextResponse.json(
      {
        success: true,
        userComments,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load Comments",
      },
      { status: 500 },
    );
  }
}
