import { auth } from "@/auth";
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
        take: 10,
      });

      return NextResponse.json(searchedAuthors);
    }

    const session = await auth();
    const currentUserId = session?.user?.id;

    const whereCondition = currentUserId ? { id: { not: currentUserId } } : {};

    const count = await db.user.count({
      where: whereCondition,
    });
    const take = 3;
    const skip = Math.max(0, Math.floor(Math.random() * (count - take)));

    const randomAuthors = await db.user.findMany({
      where: whereCondition,
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
