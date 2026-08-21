import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json(
        {
          success: true,
          data: [],
        },
        { status: 200 },
      );
    }

    const searchTerm = query.trim();

    const results = await db.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        count: results.length,
        data: results,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong fetching search results",
      },
      { status: 500 },
    );
  }
}
