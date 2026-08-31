import { Post } from "@/types/post";
import { Bookmark, Check, MoreVertical, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface PostMenuProps {
  post: Post;
  savedPostIds: Set<string>;
  onToggleSave: (postId: string) => void;
}

export function PostMenu({ post, savedPostIds, onToggleSave }: PostMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isSaved = savedPostIds.has(post.id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const postUrl = `${window.location.origin}/blog/${post.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: postUrl,
        });
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        toast.success("Link copied to clipboard!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
        toast.error("Failed to copy link");
      }
    }
    setIsOpen(false);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave(post.id);
    setIsOpen(false);
  };

  return (
    <div className="relative z-20" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition duration-150 cursor-pointer"
        aria-label="Post options"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[#19243b] border border-white/10 rounded-xl shadow-2xl py-1.5 backdrop-blur-md z-30 animate-in fade-in zoom-in-95 duration-150">
          <button
            type="button"
            onClick={handleSave}
            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2.5 transition duration-150 cursor-pointer"
          >
            <Bookmark
              className={`w-4 h-4 ${
                isSaved ? "fill-blue-400 text-blue-400" : "text-slate-400"
              }`}
            />
            {isSaved ? "Unsave Article" : "Save Article"}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2.5 transition duration-150 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>Copied Link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}