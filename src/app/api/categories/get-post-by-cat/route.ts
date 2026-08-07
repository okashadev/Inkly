import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Category slug is required." },
        { status: 400 },
      );
    }

    const blogByCat = await db.post.findMany({
      where: {
        category: {
          slug: slug,
        },
      },
      orderBy: [{ createdAt: "desc" }],
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (blogByCat.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No Blogs found in this category.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        blogs: blogByCat,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Get Blog By Category Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch blogs",
      },
      { status: 500 },
    );
  }
}
