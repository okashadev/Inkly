import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return Response.json(
      {
        success: true,
        data: categories,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      },
    );
  } catch (error: any) {
    console.error("[GET_CATEGORIES_ERROR]:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to fetch categories.",
      },
      { status: 500 },
    );
  }
}
