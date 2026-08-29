"use client";
import { Comment } from "@/types/comment";
import { formatTimeAgo } from "@/utils/formatTime";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CommentSectionProps {
  postId: string;
  status: string;
  onAuthRequired?: () => void;
}

const CommentSection = ({
  postId,
  status,
  onAuthRequired,
}: CommentSectionProps) => {
  const [isCommentSubmitLoading, setIsCommentSubmitLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    async function fetchComments() {
      if (!postId) return;
      try {
        const res = await fetch(`/api/post/comment?postId=${postId}`);
        const data = await res.json();
        if (data.success) {
          setComments(data.comments);
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
      }
    }

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (status === "unauthenticated") {
      onAuthRequired?.();
      return;
    }

    if (!commentInput.trim() || !postId) return;

    setIsCommentSubmitLoading(true);
    try {
      const res = await fetch("/api/post/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: postId,
          content: commentInput,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setCommentInput("");
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsCommentSubmitLoading(false);
    }
  };
  return (
    <>
      <section id="comments-section" className="mt-16 space-y-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Comments ({comments.length})
        </h3>

        <form
          onSubmit={handleCommentSubmit}
          className="p-5 bg-[#131b2e]/80 border border-white/10 rounded-2xl space-y-4 shadow-xl"
        >
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder={
              status === "authenticated"
                ? "What are your thoughts?"
                : "Log in to join the conversation..."
            }
            rows={3}
            className="w-full bg-[#0b1326] text-white border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 transition resize-none placeholder:text-slate-500"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCommentSubmitLoading || !commentInput.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition duration-200"
            >
              Post Comment
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-5 bg-[#131b2e]/40 border border-white/5 rounded-2xl space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 border border-white/10 relative shrink-0">
                    {comment.author?.image ? (
                      <Image
                        src={comment.author?.image}
                        alt={comment.author?.name || "User Avatar"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold text-xs">
                        {comment?.author?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {comment.author?.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {formatTimeAgo(comment.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-300/90 leading-relaxed pl-12">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default CommentSection;
