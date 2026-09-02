import { NextResponse } from "next/server";
import crypto from "crypto";
import { transporter } from "@/lib/nodemailer";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email address is required." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "If an account is associated with this email, we've sent a reset link. Please double-check your email spelling if you don't receive it.",
        },
        { status: 200 },
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const appUrl = process.env.AUTH_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;

    await transporter.sendMail({
      from: `"Inkly Support" <${process.env.SENDER_EMAIL}>`,
      to: normalizedEmail,
      subject: "Reset your Inkly password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e4e4e7; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <tr>
                    <td align="center" style="padding-bottom: 24px;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #09090b; letter-spacing: -0.5px;">Inkly</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="border-bottom: 1px solid #f4f4f5; padding-bottom: 20px;"></td>
                  </tr>

                  <tr>
                    <td style="padding-top: 24px;">
                      <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #18181b;">Reset your password</h2>
                      <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #52525b;">
                        We received a request to reset the password for your Inkly account. Click the button below to choose a new password:
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding: 12px 0 28px 0;">
                      <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #09090b; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);">
                        Reset Password
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 20px; color: #71717a;">
                        This password reset link will expire in <strong>1 hour</strong>.
                      </p>
                      <p style="margin: 0; font-size: 13px; line-height: 20px; color: #71717a;">
                        If you didn't request a password reset, you can safely ignore this email — your password won't change.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-top: 28px; border-top: 1px solid #f4f4f5; margin-top: 28px;">
                      <p style="margin: 0; font-size: 12px; line-height: 18px; color: #a1a1aa; word-break: break-all;">
                        Button not working? Copy and paste this URL into your browser:<br>
                        <a href="${resetUrl}" style="color: #2563eb; text-decoration: underline;">${resetUrl}</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      {
        message:
          "Password reset link has been sent. Please check your inbox and spam folder.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred while processing your request. Please try again later.",
      },
      { status: 500 },
    );
  }
}
