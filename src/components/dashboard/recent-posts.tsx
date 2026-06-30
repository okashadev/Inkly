import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Post = {
  title: string
  excerpt: string
  status: "Published" | "Draft"
  date: string
  image: string
  imageAlt: string
}

const posts: Post[] = [
  {
    title: "Mastering React Server Components",
    excerpt:
      "Deep dive into the architecture of modern web applications using Next.js 14 and server-side logic...",
    status: "Published",
    date: "Oct 12, 2023",
    image: "/images/post-react.jpg",
    imageAlt: "Abstract visualization of React code components",
  },
  {
    title: "Architecture for Design Systems",
    excerpt:
      "How we built a scalable token-based system that powers our entire platform across mobile and web...",
    status: "Draft",
    date: "Oct 10, 2023",
    image: "/images/post-workspace.jpg",
    imageAlt: "Minimalist developer workspace with laptop and lamp",
  },
  {
    title: "The Psychology of Minimalism",
    excerpt:
      "Why less is often more when it comes to long-form editorial content and digital reading experiences...",
    status: "Published",
    date: "Oct 05, 2023",
    image: "/images/post-typography.jpg",
    imageAlt: "Hand-lettered calligraphy on white paper",
  },
]

export function RecentPosts() {
  return (
    <section aria-label="Recent posts" className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-2xl font-bold text-foreground">Your Recent Posts</h4>
        {/* <button
          type="button"
          className="text-sm font-medium text-primary underline-offset-4 decoration-2 transition-all hover:underline"
        >
          View all library
        </button> */}
      </div>

      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.title}
            className="group flex flex-col gap-6 rounded-2xl bg-surface-container-low p-5 transition-colors hover:bg-surface-container md:flex-row md:items-center"
          >
            <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-surface-container-high md:w-40">
              <Image
                src={post.image}
                alt={post.imageAlt}
                width={320}
                height={224}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest",
                    post.status === "Published"
                      ? "bg-primary/10 text-primary"
                      : "bg-surface-container-highest text-muted-foreground",
                  )}
                >
                  {post.status}
                </span>
                <span className="text-xs font-medium text-outline">{post.date}</span>
              </div>
              <h5 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                {post.title}
              </h5>
              <p className="line-clamp-1 text-sm text-muted-foreground">{post.excerpt}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full p-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                aria-label={`Edit post: ${post.title}`}
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="rounded-full p-2 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Delete post: ${post.title}`}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
