import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function generateSlug(title: string) {
  const cleanTitle = title && title.trim() ? title : "untitled-draft";
  const baseSlug = cleanTitle
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const uniqueSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${uniqueSuffix}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const rawTitle = formData.get("title") as string;
    const content = formData.get("content") as string;
    const description = (formData.get("description") as string) || null;
    const categoryId = formData.get("categoryId") as string | null;
    const readingTime = parseInt(
      (formData.get("readingTime") as string) || "1",
    );
    const published = formData.get("published") === "true";

    const authorId = (formData.get("authorId") as string) || "dummy_author_id";

    const title =
      rawTitle && rawTitle.trim() !== "" ? rawTitle : "Untitled Draft";

    if (published && (!rawTitle || !categoryId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Title and category are required to publish.",
        },
        { status: 400 },
      );
    }

    const slug = generateSlug(title);

    const file = formData.get("coverImage") as File | null;
    let coverImageUrl: string | null = null;

    if (file && file.size > 0) {
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
            },
          )
          .end(buffer);
      });

      coverImageUrl = uploadResult.secure_url;
    }

    const newPost = await db.post.create({
      data: {
        title,
        slug,
        content,
        description,
        coverImage: coverImageUrl,
        readingTime,
        published,
        author: {
          connect: { id: authorId },
        },
        ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: published
          ? "Blog Published Successfully."
          : "Draft Saved Successfully.",
        post: newPost,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Post Creation API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create post",
      },
      { status: 500 },
    );
  }
}
