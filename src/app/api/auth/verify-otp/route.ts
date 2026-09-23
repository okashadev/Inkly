import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "@/lib/db";

const verifyOtpSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be a 6-digit code")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = verifyOtpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0]?.message || "Invalid input parameters." },
        { status: 400 }
      );
    }

    const { email, otp } = validation.data;

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        emailVerified: true,
        otpCode: true,
        otpExpiry: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User account not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified. Please proceed to login." },
        { status: 400 }
      );
    }

    if (!user.otpCode || !user.otpExpiry) {
      return NextResponse.json(
        { message: "No verification code found. Please request a new code." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    const isOtpValid = await bcrypt.compare(otp, user.otpCode);

    if (!isOtpValid) {
      return NextResponse.json(
        { message: "Invalid verification code. Please try again." },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        otpCode: null,
        otpExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Email verified successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[VERIFY_OTP_ERROR]:", error);
    return NextResponse.json(
      { message: "An error occurred while verifying OTP" },
      { status: 500 }
    );
  }
}