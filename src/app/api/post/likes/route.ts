import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 },
      );
    }
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    const existingLike = await db.like.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    let isLiked = false;

    if (existingLike) {
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      isLiked = false;
    } else {
      await db.like.create({
        data: {
          postId: postId,
          userId: userId,
        },
      });
      isLiked = true;
    }

    const totalLikes = await db.like.count({
      where: { postId: postId },
    });

    return NextResponse.json(
      {
        success: true,
        isLiked,
        likesCount: totalLikes,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Like API Error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
