import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { transporter } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username, email, password } = body;

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const existingEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
          field: "email",
        },
        { status: 409 }
      );
    }

    const existingUsername = await db.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken",
          field: "username",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const plainOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(plainOtp, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await db.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        emailVerified: null,
        otpCode: hashedOtp,
        otpExpiry,
      },
    });

    const mailOptions = {
      from: `"Inkly Support" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Welcome to Inkly - Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b1326; padding: 40px; color: #ffffff; text-align: center;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #111c38; border-radius: 16px; padding: 32px; border: 1px solid #1e293b;">
            <h2 style="color: #6366f1; margin-bottom: 8px;">Welcome to Inkly, ${name}!</h2>
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
      {
        success: true,
        message: "Account created! Please check your email for the verification code.",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your account",
      },
      { status: 500 }
    );
  }
}