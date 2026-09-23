import { type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import cloudinary, { getCloudinaryPublicId } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import calculateReadingTime from "@/utils/calculateReadingTime";

const updatePostSchema = z
  .object({
    title: z.string().trim().optional(),
    content: z.string().trim().optional().default(""),
    description: z
      .string()
      .trim()
      .transform((val) => (val === "" ? null : val))
      .optional(),
    categoryId: z
      .string()
      .trim()
      .transform((val) => (val === "" ? null : val))
      .optional(),
    published: z.preprocess(
      (val) => val === "true" || val === true,
      z.boolean(),
    ),
  })
  .refine(
    (data) => {
      if (data.published) {
        return !!data.title && data.title.length > 0 && !!data.categoryId;
      }
      return true;
    },
    {
      message: "Title and Category are required to publish a post.",
      path: ["published"],
    },
  );


const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function PUT(req: NextRequest) {
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
    const postId = searchParams.get("id")?.trim();

    if (!postId) {
      return Response.json(
        { success: false, error: "Post ID is required." },
        { status: 400 },
      );
    }

    const existingPost = await db.post.findFirst({
      where: {
        id: postId,
        authorId: userId,
      },
      select: {
        id: true,
        coverImage: true,
      },
    });

    if (!existingPost) {
      return Response.json(
        { success: false, error: "Post not found or unauthorized to edit." },
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const rawData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      description: formData.get("description") as string,
      categoryId: formData.get("categoryId") as string,
      published: formData.get("published"),
    };

    const validationResult = updatePostSchema.safeParse(rawData);

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          error: "Validation failed.",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { content, description, categoryId, published } =
      validationResult.data;
    const rawTitle = validationResult.data.title;
    const title = rawTitle && rawTitle !== "" ? rawTitle : "Untitled Draft";

    if (categoryId) {
      const categoryExists = await db.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });

      if (!categoryExists) {
        return Response.json(
          { success: false, error: "Selected category does not exist." },
          { status: 400 },
        );
      }
    }

    const file = formData.get("coverImage") as File | null;
    let coverImageUrl = existingPost.coverImage;

    if (file && typeof file !== "string" && file.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return Response.json(
          {
            success: false,
            error: "Invalid image format. Allowed: JPEG, PNG, WEBP, AVIF.",
          },
          { status: 400 },
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return Response.json(
          { success: false, error: "Cover image size must be less than 5MB." },
          { status: 400 },
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "inkly_blog_covers",
              resource_type: "image",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error || !result) reject(error || new Error("Upload failed"));
              else resolve(result as { secure_url: string });
            },
          );
          uploadStream.end(buffer);
        },
      );

      if (existingPost.coverImage) {
        const publicId = getCloudinaryPublicId(existingPost.coverImage);
        if (publicId) {
          cloudinary.uploader.destroy(publicId).catch((err) => {
            console.error("Failed to delete old image from Cloudinary:", err);
          });
        }
      }

      coverImageUrl = uploadResult.secure_url;
    }

    const readingTime = calculateReadingTime(content);

    const updatedPost = await db.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        description,
        published,
        readingTime,
        coverImage: coverImageUrl,
        ...(categoryId ? { categoryId } : { categoryId: null }),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        coverImage: true,
        updatedAt: true,
      },
    });

    return Response.json(
      {
        success: true,
        message: published
          ? "Blog published successfully."
          : "Draft updated successfully.",
        post: updatedPost,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[UPDATE_POST_API_ERROR]:", error);
    return Response.json(
      {
        success: false,
        error: "Internal Server Error: Failed to update post.",
      },
      { status: 500 },
    );
  }
}
