import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const featuredPosts = await db.post.findMany({
      where: {
        published: true,
      },
      take: 3,
      orderBy: [
        { likes: { _count: "desc" } },
        { comments: { _count: "desc" } },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (featuredPosts.length === 0) {
      return Response.json(
        {
          success: true,
          posts: [],
        },
        { status: 200 }
      );
    }


    const postIds = featuredPosts.map((post) => post.id);

    let savedPostIdsSet = new Set<string>();

    if (userId) {
      const savedPosts = await db.savedPost.findMany({
        where: {
          userId,
          postId: { in: postIds },
        },
        select: { postId: true },
      });

      savedPostIdsSet = new Set(savedPosts.map((sp) => sp.postId));
    }

    const postsWithSaveState = featuredPosts.map((post) => ({
      ...post,
      isSaved: savedPostIdsSet.has(post.id),
    }));

    return Response.json(
      {
        success: true,
        posts: postsWithSaveState,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET_FEATURED_POSTS_ERROR]:", error);
    return Response.json(
      { success: false, error: "Internal Server Error: Failed to fetch featured posts." },
      { status: 500 }
    );
  }
}