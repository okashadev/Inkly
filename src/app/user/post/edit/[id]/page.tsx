"use client";

import { use } from "react";
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

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "loading") {
    return <EditorLoading />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-white p-8">Please log in to Edit a post.</div>
    );
  }

  return <InklyPostWorkspace user={user} initialPostId={id} />;
}
