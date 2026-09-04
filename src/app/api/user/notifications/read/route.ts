import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    let notificationId: string | undefined;
    try {
      const body = await req.json();
      notificationId = body.notificationId;
    } catch {
    }

    if (notificationId) {
      const updated = await db.notification.updateMany({
        where: {
          id: notificationId,
          receiverId: userId,
        },
        data: { read: true },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Notification marked as read",
          count: updated.count,
        },
        { status: 200 }
      );
    } else {
      const updated = await db.notification.updateMany({
        where: {
          receiverId: userId,
          read: false,
        },
        data: { read: true },
      });

      return NextResponse.json(
        {
          success: true,
          message: "All notifications marked as read",
          count: updated.count,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("[MARK_READ_ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}