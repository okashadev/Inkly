import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "@/lib/db";
import { transporter } from "@/lib/nodemailer";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { name, username, email, password } = validation.data;

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: {
        email: true,
        username: true,
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already exists",
            field: "email",
          },
          { status: 409 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          {
            success: false,
            message: "Username already taken",
            field: "username",
          },
          { status: 409 }
        );
      }
    }

    const plainOtp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const [hashedPassword, hashedOtp] = await Promise.all([
      bcrypt.hash(password, 10),
      bcrypt.hash(plainOtp, 10),
    ]);

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
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
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

    await transporter.sendMail(mailOptions).catch((err) => {
      console.error("[REGISTER_MAIL_SEND_ERROR]:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created! Please check your email for the verification code.",
        user,
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