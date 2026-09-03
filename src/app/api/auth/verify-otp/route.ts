import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    if (otp.length !== 6) {
      return NextResponse.json(
        { message: "OTP must be a 6-digit code" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
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