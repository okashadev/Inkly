"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Menu,
  Settings,
  X,
  Upload,
  Clock,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

interface WorkspaceProps {
  user:
    | {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      }
    | undefined;
  initialPostId?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function InklyPostWorkspace({
  user,
  initialPostId,
}: WorkspaceProps) {
  const [postId, setPostId] = useState<string | null>(initialPostId || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    coverFile: null as File | null,
    coverPreview: "",
    readingTime: 1,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const editor = useCreateBlockNote();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setCategories(resData.data);
        }
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (isDataLoaded) return;

    if (initialPostId && session?.user?.id) {
      fetch(`/api/user/post/edit?id=${initialPostId}`)
        .then(async (res) => {
          const resData = await res.json();

          if (res.status === 403 || res.status === 401 || !resData.success) {
            toast.error(
              resData.error || "You are not authorized to edit this post.",
            );
            router.push("/user/dashboard");
            return null;
          }

          return resData;
        })
        .then((resData) => {
          if (!resData || !resData.post) return;

          const post = resData.post;

          if (post.authorId !== session.user.id) {
            toast.error("Access Denied");
            router.push("/user/dashboard");
            return;
          }

          setFormData({
            title: post.title || "",
            description: post.description || "",
            categoryId: post.categoryId || "",
            coverFile: null,
            coverPreview: post.coverImage || "",
            readingTime: post.readingTime || 1,
          });

          if (post.content && editor) {
            async function loadHTML() {
              try {
                const blocks = await editor.tryParseHTMLToBlocks(post.content);
                editor.replaceBlocks(editor.document, blocks);
              } catch (error) {
                console.error("Editor content parse error:", error);
              }
            }
            loadHTML();
          }
          setIsDataLoaded(true);
        })
        .catch((err) => {
          console.error("Error fetching post details:", err);
          toast.error("Post details load nahi ho sakayn.");
        });
    }
  }, [initialPostId, editor, session?.user?.id, status, router, isDataLoaded]);

  const handleEditorChange = () => {
    let totalText = "";
    editor.document.forEach((block) => {
      if (block.content && Array.isArray(block.content)) {
        block.content.forEach((inlineContent) => {
          if (inlineContent.type === "text") {
            totalText += " " + inlineContent.text;
          }
        });
      }
    });

    const words = totalText
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const calculatedTime = Math.max(1, Math.ceil(words.length / 200));

    setFormData((prev) => ({ ...prev, readingTime: calculatedTime }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        coverFile: file,
        coverPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handlePublish = async (isPublishedStatus: boolean) => {
    let currentTitle = formData.title;

    if (isPublishedStatus) {
      if (!currentTitle || !currentTitle.trim()) {
        toast.warning("Please enter a Title before publishing.");
        return;
      }
      if (!formData.categoryId) {
        toast.warning("Please select a Category before publishing.");
        setIsSettingsOpen(true);
        return;
      }

      if (!formData.coverPreview) {
        toast.warning("Please upload a Cover Image before publishing.");
        setIsSettingsOpen(true);
        return;
      }
    } else {
      if (!currentTitle || !currentTitle.trim()) {
        currentTitle = "Untitled Draft";
      }
    }

    setIsSubmitting(true);
    try {
      const htmlContent = await editor.blocksToFullHTML(editor.document);
      const dataToSend = new FormData();

      dataToSend.append("title", currentTitle);
      dataToSend.append("description", formData.description);
      dataToSend.append("readingTime", formData.readingTime.toString());
      dataToSend.append("published", isPublishedStatus.toString());
      dataToSend.append("content", htmlContent);

      if (formData.categoryId) {
        dataToSend.append("categoryId", formData.categoryId);
      }

      if (user?.id) {
        dataToSend.append("authorId", user.id);
      }
      if (formData.coverFile) {
        dataToSend.append("coverImage", formData.coverFile);
      }

      let endpoint = "/api/user/post/add";
      let method = "POST";

      if (postId) {
        endpoint = `/api/user/post/update?id=${postId}`;
        method = "PUT";
      }

      const response = await fetch(endpoint, {
        method: method,
        body: dataToSend,
      });

      const result = await response.json();

      if (result.success) {
        if (isPublishedStatus) {
          toast.success(result.message || "Post published successfully!");
          router.push("/user/my_blogs");
          router.refresh();
        } else {
          if (!postId && result.post?.id) {
            setPostId(result.post.id);
            window.history.replaceState(
              null,
              "",
              `/user/post/edit/${result.post.id}`,
            );
          }
          toast.success(result.message || "Draft saved successfully!");
        }
      } else {
        toast.error(`Error: ${result.error || result.message}`);
      }
    } catch (error) {
      console.error("Save/Publish Error:", error);
      toast.error("Something went wrong while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const SettingsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" /> Publishing Settings
        </h3>
        {isSettingsOpen && (
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Reading Time */}
      <div className="bg-[#1e293b]/60 backdrop-blur-md p-4 rounded-xl flex justify-between items-center border border-white/5 shadow-inner">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Reading Time
          </p>
          <p className="text-base font-bold text-blue-400 mt-0.5">
            {formData.readingTime} min read
          </p>
        </div>
        <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Category Select */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" /> Category{" "}
          <span className="text-red-400">*</span>
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          className="w-full bg-[#1e293b] border border-white/10 focus:border-blue-500/50 p-3 rounded-xl text-sm text-slate-100 outline-none cursor-pointer transition-all"
        >
          <option value="" disabled>
            Select a Category
          </option>
          {categories.map((data: any) => (
            <option
              key={data.id}
              value={data.id}
              className="bg-[#0f172a] text-slate-200"
            >
              {data.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Cover Image
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {formData.coverPreview ? (
          <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-[#1e293b] group">
            <Image
              src={formData.coverPreview}
              alt="Cover Preview"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    coverFile: null,
                    coverPreview: "",
                  }))
                }
                className="bg-red-600/90 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors cursor-pointer shadow-lg"
              >
                Remove Image
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-36 border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-xl flex flex-col items-center justify-center gap-2.5 bg-[#1e293b]/30 hover:bg-blue-500/5 text-slate-400 hover:text-blue-400 transition-all text-xs font-medium cursor-pointer"
          >
            <div className="p-3 bg-white/5 rounded-full">
              <Upload className="w-5 h-5 text-slate-300" />
            </div>
            <span>Click to upload cover photo</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen font-sans antialiased selection:bg-blue-500/30">
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-[#0b1326]/80 px-4 md:px-8 backdrop-blur-xl md:left-64">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-[10px] sm:text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
            Workspace
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Settings Toggle Button */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors relative"
            aria-label="Publishing Settings"
          >
            <Settings className="w-5 h-5" />
            {!formData.categoryId && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePublish(false)}
            className="text-slate-400 hover:text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 cursor-pointer disabled:opacity-50 transition-colors"
          >
            Save Draft
          </button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePublish(true)}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 shadow-lg shadow-blue-600/20 transition-all"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </motion.button>
        </div>
      </nav>

      <main className="flex pt-20 md:pl-64 lg:pr-80 min-h-screen relative z-10">
        {/* Main Editor Canvas */}
        <div className="grow flex justify-center py-8 px-4 sm:px-8 md:px-12 max-w-4xl mx-auto w-full">
          <motion.article
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col gap-6"
          >
            <textarea
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              rows={1}
              placeholder="Title of your story..."
              className="w-full h-auto min-h-15 bg-transparent outline-none text-3xl sm:text-4xl md:text-5xl font-black text-white resize-none placeholder:text-slate-700 leading-tight"
            />

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={255}
              placeholder="Add a short description..."
              className="w-full bg-transparent outline-none text-base sm:text-lg text-slate-300 border-b border-white/5 pb-4 placeholder:text-slate-600"
            />

            <div className="min-h-100 pt-2 text-slate-100 dark">
              <BlockNoteView
                editor={editor}
                theme="dark"
                onChange={handleEditorChange}
              />
            </div>
          </motion.article>
        </div>

        {/* Desktop Sidebar Settings */}
        <aside className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-80 bg-[#0f172a] border-l border-white/5 p-6 hidden lg:flex flex-col justify-between overflow-y-auto z-30">
          <SettingsContent />
        </aside>
      </main>

      {/* Mobile Settings Drawer / Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-[#0f172a] border-t border-white/10 p-6 rounded-t-3xl z-50 lg:hidden shadow-2xl"
            >
              <SettingsContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
