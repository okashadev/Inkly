import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MyBlogsClient from "@/components/blog/MyBlogsClient";

export default async function MyBlogsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user;

  // Future Note: Aap yahan direct Prisma se user ke blogs fetch kar ke client ko pass karenge:
  // const blogs = await prisma.post.findMany({ where: { userId: user.id } })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />
      <TopNav user={user} />
      
      {/* Saara interactive aur animated UI client component handle karega */}
      <MyBlogsClient />
    </div>
  );
}