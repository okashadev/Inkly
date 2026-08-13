import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
              posts: true,
              followers: true,
            },
          },
        },
        take: 10, // Search results Limit (aap scroll / adjust kar sakte hain)
      });

      return NextResponse.json(searchedAuthors);
    }

    const count = await db.user.count();
    const take = 6;
    const skip = Math.max(0, Math.floor(Math.random() * (count - take)));

    const randomAuthors = await db.user.findMany({
      take: take,
      skip: skip,
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        _count: {
          select: {
            posts: true,
            followers: true,
          },
        },
      },
    });

    return NextResponse.json(randomAuthors);
  } catch (error: any) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500 },
    );
  }
}
