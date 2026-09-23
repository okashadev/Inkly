import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const rawLimit = parseInt(searchParams.get("limit") || "20", 10);

    const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit =
      !isNaN(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 20;
    const skip = (page - 1) * limit;

    const [notifications, unreadCount, totalNotifications] = await Promise.all([
      db.notification.findMany({
        where: { receiverId: userId },
        select: {
          id: true,
          type: true,
          message: true,
          read: true,
          link: true,
          createdAt: true,
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

    const totalPages = Math.ceil(totalNotifications / limit) || 1;

    return Response.json(
      {
        success: true,
        data: {
          notifications,
          unreadCount,
          pagination: {
            page,
            limit,
            totalPages,
            totalNotifications,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET_NOTIFICATIONS_ERROR]:", error);
    return Response.json(
      {
        success: false,
        error: "Internal Server Error: Failed to fetch notifications.",
      },
      { status: 500 },
    );
  }
}
