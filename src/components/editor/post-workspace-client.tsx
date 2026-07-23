"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { toast } from "sonner";

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

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    coverFile: null as File | null,
    coverPreview: "",
    readingTime: 1,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    if (initialPostId) {
      fetch(`/api/user/post/get?id=${initialPostId}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && resData.post) {
            const post = resData.post;

            // Form data fill karein
            setFormData({
              title: post.title || "",
              description: post.description || "",
              categoryId: post.categoryId || "",
              coverFile: null,
              coverPreview: post.coverImage || "",
              readingTime: post.readingTime || 1,
            });

            // BlockNote Editor ka content populate karein
            if (post.content) {
              async function loadHTML() {
                const blocks = await editor.tryParseHTMLToBlocks(post.content);
                editor.replaceBlocks(editor.document, blocks);
              }
              loadHTML();
            }
          }
        })
        .catch((err) => console.error("Error fetching post details:", err));
    }
  }, [initialPostId, editor]);

  //  console.log(categories);

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
      // console.log(result);

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

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen font-sans antialiased">
      <AppSidebar />

      {/* Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-[#0b1326]/80 px-6 backdrop-blur-xl md:left-64 md:px-12">
        <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md uppercase font-semibold">
          Workspace
        </span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePublish(false)}
            className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2 cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePublish(true)}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </motion.button>
        </div>
      </nav>

      <main className="flex pt-20 md:pl-64 lg:pr-80 min-h-screen relative z-10">
        {/* Main Editor Canvas */}
        <div className="grow flex justify-center py-12 px-6 md:px-12 max-w-4xl mx-auto w-full">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col gap-6"
          >
            <textarea
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              rows={1}
              placeholder="Title of your story..."
              className="w-full h-16 bg-transparent outline-none text-4xl md:text-5xl font-black text-white resize-none placeholder:text-slate-700"
            />

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={255}
              placeholder="Add a short description..."
              className="w-full bg-transparent outline-none text-lg text-slate-400 border-b border-white/5 pb-4 placeholder:text-slate-600"
            />

            <div className="min-h-100 pt-4 text-slate-100 dark">
              <BlockNoteView
                editor={editor}
                theme="dark"
                onChange={handleEditorChange}
              />
            </div>
          </motion.article>
        </div>

        {/* Sidebar Settings */}
        <aside className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-80 bg-[#0f172a] border-l border-white/5 pt-8 px-6 hidden lg:flex flex-col justify-between overflow-y-auto z-30">
          <div className="space-y-8 pb-8">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400">
              Publishing Settings
            </h3>

            {/* Reading Time */}
            <div className="bg-[#1E293B] p-4 rounded-xl flex justify-between items-center border border-white/5">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Reading Time
                </p>
                <p className="text-lg font-bold text-blue-400">
                  {formData.readingTime} min read
                </p>
              </div>
              <span className="text-2xl">⏱️</span>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full bg-[#1e293b] border border-white/5 p-3 rounded-xl text-sm text-slate-200 outline-none cursor-pointer"
              >
                <option value="" disabled>
                  Select a Category
                </option>
                {categories.map((data: any) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Cover Image
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {formData.coverPreview ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/5 bg-[#1e293b]">
                  <Image
                    src={formData.coverPreview}
                    alt="Cover Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        coverFile: null,
                        coverPreview: "",
                      }))
                    }
                    className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-1.5 rounded-lg text-xs backdrop-blur-sm transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-500/50 hover:bg-blue-500/5 text-slate-500 hover:text-slate-300 transition-all text-xs cursor-pointer"
                >
                  <span>🖼️</span> Upload Cover Image
                </button>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
