import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const description = formData.get("description") as string | null;
    const published = formData.get("published") === "true";
    const categoryId = formData.get("categoryId") as string | null;
    // Cover image logic agar form-data mein aye
    
    // Check karein ke post isi logged-in user ki hai
    const existingPost = await db.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost || existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    // Database Record Update Karein
    const updatedPost = await db.post.update({
      where: { id: postId },
      data: {
        title: title || "Untitled Draft",
        content,
        description,
        published,
        ...(categoryId ? { categoryId } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: published
          ? "Blog Published Successfully."
          : "Draft Saved Successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update Post Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update draft" },
      { status: 500 }
    );
  }
}