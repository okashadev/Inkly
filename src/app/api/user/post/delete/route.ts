import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Post ID is required." },
        { status: 400 }
      );
    }

    await db.post.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Post deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Post Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete post." },
      { status: 500 }
    );
  }
}