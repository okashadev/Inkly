"use client";

import dynamic from "next/dynamic";
import EditorLoading from "@/components/editor-loading";
import { useSession } from "next-auth/react";

const InklyPostWorkspace = dynamic(
  () => import("@/components/editor/post-workspace-client"),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  },
);

export default function NewPostPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <EditorLoading />;
  }

  if (status === "unauthenticated") {
    return <div className="text-white p-8">Please log in to create a post.</div>;
  }
  const user = session?.user;
  return <InklyPostWorkspace user={user} />;
}
