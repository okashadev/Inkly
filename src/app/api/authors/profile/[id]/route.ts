import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Author ID is required" },
        { status: 400 },
      );
    }

    const author = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
            createdAt: true,
            views: true,
            category: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                likes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        author: author,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching author profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch author profile" },
      { status: 500 },
    );
  }
}
