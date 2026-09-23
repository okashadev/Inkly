import { type NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long."),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password cannot be the same as current password.",
    path: ["newPassword"],
  });

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const validation = changePasswordSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message:
            validation.error.issues[0]?.message || "Invalid input parameters.",
        },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword } = validation.data;
    const userId = session.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    });

    if (!user) {
      return Response.json(
        { success: false, message: "User account not found." },
        { status: 404 },
      );
    }

    if (!user.password) {
      return Response.json(
        {
          success: false,
          message:
            "This account was created using social login (Google/GitHub) and does not have a password.",
        },
        { status: 400 },
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return Response.json(
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

    return Response.json(
      { success: true, message: "Password updated successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[CHANGE_PASSWORD_ERROR]:", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
