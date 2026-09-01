import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;
    const userId = session.user.id;

    if (!currentPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is required.",
        },
        { status: 400 },
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password is required.",
        },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 6 characters long.",
        },
        { status: 400 },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password cannot be the same as current password.",
        },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 },
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect current password." },
        { status: 400 },
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: userId },
      data: {
        password: newPasswordHash,
      },
    });

    return NextResponse.json(
      { success: true, message: "Password updated successfully!" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Change Password API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
