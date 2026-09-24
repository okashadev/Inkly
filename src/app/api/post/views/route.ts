import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const viewIncrementSchema = z.object({
  postId: z.string().trim().min(1, "Post ID is required."),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    let body = {};
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const parseResult = viewIncrementSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        {
          success: false,
          error: "Validation error.",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { postId } = parseResult.data;

    const cookieStore = await cookies();
    const viewCookieName = `viewed_post_${postId}`;
    const hasViewedRecently = cookieStore.get(viewCookieName);

    if (hasViewedRecently) {
      const currentPost = await db.post.findUnique({
        where: { id: postId },
        select: { views: true },
      });

      return Response.json(
        {
          success: true,
          views: currentPost?.views ?? 0,
          incremented: false,
          message: "View count already registered recently.",
        },
        { status: 200 }
      );
    }

    const post = await db.post.findUnique({
      where: { id: postId },
      select: { authorId: true, views: true },
    });

    if (!post) {
      return Response.json(
        { success: false, error: "Post not found." },
        { status: 404 }
      );
    }

    if (currentUserId && currentUserId === post.authorId) {
      return Response.json(
        {
          success: true,
          views: post.views,
          incremented: false,
          message: "Author view skipped.",
        },
        { status: 200 }
      );
    }

    const updatedPost = await db.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
      select: { views: true },
    });

    const response = Response.json(
      {
        success: true,
        views: updatedPost.views,
        incremented: true,
      },
      { status: 200 }
    );

    response.headers.append(
      "Set-Cookie",
      `${viewCookieName}=true; Max-Age=86400; Path=/; HttpOnly; SameSite=Lax`
    );

    return response;
  } catch (error) {
    console.error("[INCREMENT_VIEWS_ERROR]:", error);
    return Response.json(
      {
        success: false,
        error: "Internal Server Error: Failed to increment views.",
      },
      { status: 500 }
    );
  }
}