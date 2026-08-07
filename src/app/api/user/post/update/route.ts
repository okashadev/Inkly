import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
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
    const readingTime = parseInt(
      (formData.get("readingTime") as string) || "1"
    );

    const existingPost = await db.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost || existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    const file = formData.get("coverImage") as File | null;
    let coverImageUrl = existingPost.coverImage;

    if (file && typeof file !== "string" && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "inkly_blog_covers",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      coverImageUrl = uploadResult.secure_url;
    }

    const updatedPost = await db.post.update({
      where: { id: postId },
      data: {
        title: title || "Untitled Draft",
        content,
        description,
        published,
        readingTime,
        coverImage: coverImageUrl,
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