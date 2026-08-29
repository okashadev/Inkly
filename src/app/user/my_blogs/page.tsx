import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MyBlogsClient from "@/components/blog/MyBlogsClient";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { User } from "@/types/user";

export default async function MyBlogsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user as User;

  return (
    <DashboardShell user={user}>
      <MyBlogsClient />
    </DashboardShell>
  );
}
