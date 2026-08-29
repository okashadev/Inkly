"use client";

import Image from "next/image";
import Link from "next/link";
import { UserCheck, UserPlus } from "lucide-react";

interface Author {
  id: string;
  name?: string | null;
  image?: string | null;
  bio?: string | null;
  _count?: {
    followers?: number;
    posts?: number;
  };
}

interface AuthorBioProps {
  author?: Author | null;
  isOwnPost?: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  onFollowToggle: () => void;
}

const AuthorBio = ({
  author,
  isOwnPost,
  isFollowing,
  followLoading,
  onFollowToggle,
}: AuthorBioProps) => {
  if (!author) return null;
  return (
    <>
      <div
        id="author-bio"
        className="mt-16 p-6 sm:p-8 bg-[#131b2e]/80 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl backdrop-blur-sm"
      >
        <Link
          href={`/authors/profile/${author?.id}`}
          className="w-20 h-20 rounded-full overflow-hidden bg-slate-800 border border-white/10 relative shrink-0"
        >
          {author?.image ? (
            <Image
              src={author.image}
              alt={author.name || "Author"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold text-2xl">
              {author?.name?.[0]?.toUpperCase() || "A"}
            </div>
          )}
        </Link>

        <div className="flex-1 text-center sm:text-left space-y-3 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <Link
                href={`/authors/profile/${author?.id}`}
                className="text-lg sm:text-xl capitalize font-bold text-white hover:text-blue-400 transition"
              >
                {author?.name || "Author"}
              </Link>
            </div>
            {!isOwnPost && (
              <button
                onClick={onFollowToggle}
                disabled={followLoading}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                  followLoading ? "opacity-70" : ""
                } ${
                  isFollowing
                    ? "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                }`}
              >
                {followLoading ? (
                  "Loading..."
                ) : isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </>
                )}
              </button>
            )}
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            {author?.bio || ""}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 border-t border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm">
                {author?._count?.followers || 0}
              </span>
              <span className="text-slate-400">Followers</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm">
                {author?._count?.posts || 0}
              </span>
              <span className="text-slate-400">Articles</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthorBio;
