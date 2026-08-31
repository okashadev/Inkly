"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Heart, MessageSquare, Bookmark, UserPlus, Lock } from "lucide-react";

export type AuthActionType = "follow" | "like" | "comment" | "save" | "generic";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType?: AuthActionType;
  authorName?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  actionType = "generic",
  authorName = "authors",
}: AuthModalProps) {
  const getModalContent = () => {
    switch (actionType) {
      case "follow":
        return {
          title: "Join Inkly to Follow",
          description: (
            <>
              You need an account to follow{" "}
              <span className="text-slate-200 font-semibold">{authorName}</span>{" "}
              and get notified when they publish new stories.
            </>
          ),
          icon: <UserPlus className="w-5 h-5 text-blue-400" />,
        };
      case "like":
        return {
          title: "Join Inkly to Like",
          description: "Sign in to appreciate this story and show support to the author.",
          icon: <Heart className="w-5 h-5 text-rose-400" />,
        };
      case "comment":
        return {
          title: "Join Inkly to Comment",
          description: "Join the discussion and share your perspectives on this story.",
          icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
        };
      case "save":
        return {
          title: "Join Inkly to Save",
          description: "Create an account to bookmark your favorite articles and read them anytime.",
          icon: <Bookmark className="w-5 h-5 text-amber-400" />,
        };
      default:
        return {
          title: "Join Inkly Community",
          description: "Sign in or create an account to unlock all interactive features.",
          icon: <Lock className="w-5 h-5 text-blue-400" />,
        };
    }
  };

  const content = getModalContent();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          {/* Backdrop click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#131b2e] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center z-10"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {content.icon}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {content.title}
            </h3>

            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {content.description}
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition duration-200"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-xl font-semibold text-sm transition duration-200"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}