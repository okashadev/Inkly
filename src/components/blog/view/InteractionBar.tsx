"use client";

import { AuthActionType } from "@/components/modals/AuthModal";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Props {
  postId: string;
  postTitle: string;
  status: string;
  totalLikes: number;
  liked: boolean;
  saved: boolean;
  commentCount?: number;
  onAuthRequired?: (actionType: AuthActionType) => void;
}

const InteractionBar = ({
  postId,
  status,
  postTitle,
  commentCount,
  totalLikes = 0,
  liked = false,
  saved = false,
  onAuthRequired,
}: Props) => {
  const [likeCount, setLikeCount] = useState<number>(totalLikes);
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const [isSaved, setIsSaved] = useState(saved);

  useEffect(() => {
    setIsLiked(liked);
    setIsSaved(saved);
    setLikeCount(totalLikes);
  }, [liked, saved, totalLikes]);

  const handleSaveClick = async () => {
    if (status === "unauthenticated") {
      onAuthRequired?.("save");
      return;
    }

    if (!postId) return;

    const previousIsSaved = isSaved;
    setIsSaved(!previousIsSaved);

    try {
      const res = await fetch("/api/post/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSaved(data.isSaved);
      } else {
        setIsSaved(previousIsSaved);
        toast.error(data.message || "Failed to update bookmark");
      }
    } catch (err: any) {
      console.error("Failed to toggle Save:", err);
      setIsSaved(previousIsSaved);
      toast.error("Something went wrong!");
    }
  };

  const handleLikeClick = async () => {
    if (status === "unauthenticated") {
      onAuthRequired?.("like");
      return;
    }
    if (!postId) return;

    const previousIsLiked = isLiked;
    const previousCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const res = await fetch("/api/post/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();

      if (data.success) {
        setIsLiked(data.isLiked);
        setLikeCount(data.likesCount);
      } else {
        setIsLiked(previousIsLiked);
        setLikeCount(previousCount);
      }
    } catch (err: any) {
      console.error("Failed to toggle like:", err);
      setIsLiked(previousIsLiked);
      setLikeCount(previousCount);
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          url: window.location.href,
        });
      } catch (err: any) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleCommentClick = async () => {
    if (status === "unauthenticated") {
      onAuthRequired?.("comment");
      return;
    }
  };

  return (
    <div className="my-10 py-4 px-6 bg-[#131b2e]/60 border border-white/10 rounded-2xl flex items-center justify-between gap-4 backdrop-blur-md">
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          className={`flex items-center gap-2 text-sm font-semibold transition active:scale-95 ${
            isLiked ? "text-rose-500" : "text-slate-400 hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span>{likeCount}</span>
        </button>

        <a
          href="#comments-section"
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition"
          onClick={handleCommentClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
          <span>{commentCount}</span>
        </a>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Save / Bookmark Button */}
        <button
          onClick={handleSaveClick}
          className={`p-2 rounded-xl border border-white/5 transition active:scale-95 ${
            isSaved
              ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
              : "text-slate-400 hover:text-white bg-slate-800/40"
          }`}
          title="Bookmark"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShareClick}
          className="p-2 text-slate-400 hover:text-white bg-slate-800/40 border border-white/5 rounded-xl transition active:scale-95"
          title="Share"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InteractionBar;
