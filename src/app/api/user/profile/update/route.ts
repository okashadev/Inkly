import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const body = await req.json();

    const { name, username, bio, image } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 },
      );
    }

    if (!username || !username.trim()) {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 },
      );
    }

    const trimmedUsername = username.trim();

    const existingUser = await db.user.findFirst({
      where: {
        username: trimmedUsername,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Username already taken" },
        { status: 409 },
      );
    }

    let imageUrl = image;

    if (image && image.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "profile_pictures",
        resource_type: "image",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        username: trimmedUsername,
        bio: bio !== undefined ? bio.trim() : undefined,
        image: imageUrl !== undefined ? imageUrl : undefined,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("PROFILE_UPDATE_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
