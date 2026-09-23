import { type NextRequest } from "next/server";
import { auth } from "@/auth";
import cloudinary, { getCloudinaryPublicId } from "@/lib/cloudinary";
import { db } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id")?.trim();

    if (!postId) {
      return Response.json(
        { success: false, error: "Post ID is required." },
        { status: 400 }
      );
    }

    const post = await db.post.findFirst({
      where: {
        id: postId,
        authorId: userId,
      },
      select: {
        id: true,
        coverImage: true,
      },
    });

    if (!post) {
      return Response.json(
        {
          success: false,
          error: "Post not found or you do not have permission to delete it.",
        },
        { status: 404 }
      );
    }

    if (post.coverImage) {
      const publicId = getCloudinaryPublicId(post.coverImage);
      if (publicId) {
        cloudinary.uploader.destroy(publicId).catch((err) => {
          console.error("Failed to delete Cloudinary cover image:", err);
        });
      }
    }

    await db.post.delete({
      where: { id: post.id },
    });

    return Response.json(
      {
        success: true,
        message: "Post deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_POST_API_ERROR]:", error);
    return Response.json(
      { success: false, error: "Internal Server Error: Failed to delete post." },
      { status: 500 }
    );
  }
}