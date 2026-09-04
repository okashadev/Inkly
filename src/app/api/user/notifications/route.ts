import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const userId = session.user.id;


    const [notifications, unreadCount, totalNotifications] = await Promise.all([
      db.notification.findMany({
        where: { receiverId: userId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),

      db.notification.count({
        where: {
          receiverId: userId,
          read: false,
        },
      }),

      db.notification.count({
        where: { receiverId: userId },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          notifications,
          unreadCount,
          pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalNotifications / limit),
            totalNotifications,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET_NOTIFICATIONS_ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}