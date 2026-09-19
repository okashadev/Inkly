import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "@/lib/db";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error:
            validation.error.issues[0]?.message || "Invalid input parameters.",
        },
        { status: 400 },
      );
    }
    const { token, email, password } = validation.data;

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await db.user.findFirst({
      where: {
        email,
        resetToken: hashedResetToken,
      },
      select: {
        id: true,
        resetTokenExpiry: true,
      },
    });

    if (!user || !user.resetTokenExpiry) {
      return NextResponse.json(
        { error: "Invalid or expired password reset link." },
        { status: 400 },
      );
    }

    if (new Date() > new Date(user.resetTokenExpiry)) {
      return NextResponse.json(
        {
          error:
            "This password reset link has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Password updated successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
