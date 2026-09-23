import { type NextRequest } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import { db } from "@/lib/db";
import calculateReadingTime from "@/utils/calculateReadingTime";

const createPostSchema = z
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
      // Direct conditional validation rule
      if (data.published) {
        return !!data.title && data.title.length > 0 && !!data.categoryId;
      }
      return true;
    },
    {
      message: "Title and Category are required when publishing a post.",
      path: ["published"],
    },
  );

function generateSlug(title: string): string {
  const cleanTitle = title && title.trim() ? title : "untitled-draft";
  const baseSlug = cleanTitle
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const uniqueSuffix = crypto.randomBytes(3).toString("hex");
  return `${baseSlug}-${uniqueSuffix}`;
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 },
      );
    }

    const authorId = session.user.id;
    const formData = await req.formData();

    const rawData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      description: formData.get("description") as string,
      categoryId: formData.get("categoryId") as string,
      published: formData.get("published"),
    };

    const validationResult = createPostSchema.safeParse(rawData);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.flatten().fieldErrors;
      return Response.json(
        {
          success: false,
          error: "Validation failed.",
          details: formattedErrors,
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
    let coverImageUrl: string | null = null;

    if (file && file.size > 0) {
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

      coverImageUrl = uploadResult.secure_url;
    }

    const slug = generateSlug(title);
    const readingTime = calculateReadingTime(content);

    const newPost = await db.post.create({
      data: {
        title,
        slug,
        content,
        description,
        coverImage: coverImageUrl,
        readingTime,
        published,
        authorId,
        ...(categoryId ? { categoryId } : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        coverImage: true,
        createdAt: true,
      },
    });

    return Response.json(
      {
        success: true,
        message: published
          ? "Blog published successfully."
          : "Draft saved successfully.",
        post: newPost,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[CREATE_POST_API_ERROR]:", error);
    return Response.json(
      {
        success: false,
        error: "Internal Server Error: Failed to create post.",
      },
      { status: 500 },
    );
  }
}
