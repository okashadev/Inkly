import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (query) {
      const searchedAuthors = await db.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { username: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
          _count: {
            select: {
              posts: {
                where: { published: true },
              },
              followers: true,
            },
          },
        },
        take: 10,
      });

      return Response.json(
        {
          success: true,
          authors: searchedAuthors,
        },
        { status: 200 }
      );
    }

    const session = await auth();
    const currentUserId = session?.user?.id;

    const recommendedAuthors = await db.user.findMany({
      where: currentUserId ? { id: { not: currentUserId } } : {},
      take: 3,
      orderBy: [
        { followers: { _count: "desc" } },
        { posts: { _count: "desc" } },
      ],
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        _count: {
          select: {
            posts: {
              where: { published: true },
            },
            followers: true,
          },
        },
      },
    });

    return Response.json(
      {
        success: true,
        authors: recommendedAuthors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET_SEARCH_AUTHORS_ERROR]:", error);
    return Response.json(
      { success: false, error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}