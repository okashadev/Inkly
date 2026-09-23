import { type NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required to delete your account."),
});

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized access. Please log in." },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const body = await req.json().catch(() => ({}));

    const validation = deleteAccountSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Password is required.",
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const { password } = validation.data;

    const dbUser = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        name: true,
      },
    });

    if (!dbUser || !dbUser.password) {
      return Response.json(
        { success: false, error: "User record or password not found." },
        { status: 404 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordValid) {
      return Response.json(
        { success: false, error: "Incorrect password. Access denied." },
        { status: 403 },
      );
    }

    await db.$transaction(async (tx) => {
      await tx.notification.deleteMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      });

      await tx.follow.deleteMany({
        where: {
          OR: [{ followerId: userId }, { followingId: userId }],
        },
      });

      await tx.like.deleteMany({
        where: { userId },
      });

      await tx.comment.deleteMany({
        where: { authorId: userId },
      });

      await tx.post.deleteMany({
        where: { authorId: userId },
      });

      await tx.user.delete({
        where: { id: userId },
      });
    });

    return Response.json(
      {
        success: true,
        message: `Account for ${dbUser.name || "user"} deleted successfully.`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[ACCOUNT_DELETE_ERROR]:", error);
    return Response.json(
      { success: false, error: "Failed to delete account. Please try again." },
      { status: 500 },
    );
  }
}
