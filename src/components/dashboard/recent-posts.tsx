import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecentPostsProps } from "@/types/post";

export function RecentPosts({ posts }: RecentPostsProps) {
  if (!posts || posts.length === 0) {
    return <p className="text-gray-400">No recent posts found.</p>;
  }

  return (
    <section aria-label="Recent posts" className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-xl font-bold text-foreground">
          Your Recent Posts
        </h4>
        <Link
          href="/user/my_blogs"
          className="flex items-center gap-1 text-xs font-semibold text-primary transition-opacity hover:opacity-80"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant/20 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            You haven't written any posts yet.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="group flex flex-col gap-4 rounded-2xl border border-outline-variant/10 bg-surface-container-low p-4 transition-all hover:border-outline-variant/20 sm:flex-row sm:items-center"
            >
              {/* Cover Image */}
              <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-surface-container-high sm:w-36">
                <Image
                  src={post.coverImage || "/images/placeholder.jpg"}
                  alt={post.title}
                  width={240}
                  height={160}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Post Details */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      post.published === true
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-container-highest text-muted-foreground",
                    )}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <Link href={`/blog/${post.id}`}>
                  <h5 className="font-display text-base font-bold text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h5>
                </Link>

                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {post.description}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1 self-end sm:self-center">
                <Link
                  href={`/user/post/edit/${post.id}`}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  aria-label={`Edit post: ${post.title}`}
                >
                  <Pencil className="h-4 w-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
