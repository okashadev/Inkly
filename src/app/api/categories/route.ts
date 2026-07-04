import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(
      {
        success: true,
        data: categories,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      "❌ CRITICAL DATABASE SELECTION ERROR:",
      error.message || error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch.",
        details: error.message || "Unknown db sync issue",
      },
      { status: 500 },
    );
  }
}
