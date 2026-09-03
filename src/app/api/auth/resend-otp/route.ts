import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { transporter } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email address is required" },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User account not found" },
        { status: 404 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 },
      );
    }

    const plainOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(plainOtp, 10);

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.user.update({
      where: { id: user.id },
      data: {
        otpCode: hashedOtp,
        otpExpiry,
      },
    });

    const mailOptions = {
      from: `"Inkly Support" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Your Inkly Verification Code",
      html: `
         <div style="font-family: Arial, sans-serif; background-color: #0b1326; padding: 40px; color: #ffffff; text-align: center;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #111c38; border-radius: 16px; padding: 32px; border: 1px solid #1e293b;">
            <h2 style="color: #6366f1; margin-bottom: 8px;">Inkly Verification Code!</h2>
            <p style="color: #94a3b8; font-size: 14px;">Use the verification code below to verify your email address:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #818cf8; margin: 24px 0; background-color: #0b1326; padding: 16px; border-radius: 12px;">
              ${plainOtp}
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 24px;">This code will expire in 10 minutes. If you did not sign up for Inkly, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "A new verification code has been sent to your email." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[RESEND_OTP_ERROR]:", error);
    return NextResponse.json(
      { message: "Failed to send verification code. Please try again." },
      { status: 500 },
    );
  }
}
