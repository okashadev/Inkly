import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized Access",
        },
        { status: 401 },
      );
    }

    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    const existingSave = await db.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingSave) {
      await db.savedPost.delete({
        where: {
          id: existingSave.id,
        },
      });

      return NextResponse.json(
        {
          success: true,
          isSaved: false,
          message: "Blog removed from saved blogs!",
        },
        { status: 200 },
      );
    } else {
      await db.savedPost.create({
        data: {
          userId,
          postId,
        },
      });

      return NextResponse.json(
        {
          success: true,
          isSaved: true,
          message: "Blog Saved!",
        },
        { status: 201 },
      );
    }
  } catch (error: any) {
    console.error("Save Post Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
