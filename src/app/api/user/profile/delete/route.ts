import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function DELETE() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized access",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Your Account Has been Deleted Successfully! ${session.user.name}`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("PROFILE_DELETE_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
