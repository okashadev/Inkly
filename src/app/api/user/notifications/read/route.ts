import { type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const markReadSchema = z.object({
  notificationId: z.string().trim().min(1).optional(),
  markAll: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    let rawBody = {};
    try {
      rawBody = await req.json();
    } catch {}

    const parseResult = markReadSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid request payload.",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { notificationId } = parseResult.data;

    const whereClause = notificationId
      ? {
          id: notificationId,
          receiverId: userId,
          read: false,
        }
      : {
          receiverId: userId,
          read: false,
        };

    const updated = await db.notification.updateMany({
      where: whereClause,
      data: { read: true },
    });

    const isSingle = !!notificationId;

    return Response.json(
      {
        success: true,
        message: isSingle
          ? "Notification marked as read."
          : "All notifications marked as read.",
        count: updated.count,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[MARK_NOTIFICATION_READ_ERROR]:", error);
    return Response.json(
      {
        success: false,
        error: "Internal Server Error: Failed to mark notification as read.",
      },
      { status: 500 },
    );
  }
}
