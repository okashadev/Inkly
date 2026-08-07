"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { useSession } from "next-auth/react";
import Spinner from "@/components/home/Spinner";
import Image from "next/image";
import { HiCamera, HiTrash, HiArrowUpTray, HiUser } from "react-icons/hi2";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setImage(user.image || "");
    }
  }, [user]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-xl font-bold text-white flex justify-center items-center gap-4">
          <Spinner />
          <span>Inkly</span>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      setError("Image size should be less than 800KB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          bio,
          image,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile");
      }

      await update({
        user: {
          name: data.user.name,
          username: data.user.username,
          bio: data.user.bio,
          image: data.user.image,
        },
      });

      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-[#F8FAFC]">
      <AppSidebar />
      <TopNav user={user} />

      <main className="lg:pl-64 pt-20 transition-all duration-300 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 space-y-10">
          
          {/* Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border-b border-white/10 pb-6"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
              Public Profile
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Update your photo, bio, and public author details.
            </p>
          </motion.section>

          {/* Profile Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#131C35]/60 p-6 sm:p-8 rounded-2xl border border-white/10 backdrop-blur-sm space-y-6"
          >
            {/* Feedback Messages */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">
                {success}
              </div>
            )}

            {/* Avatar Upload */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-white/10 pb-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-500/30 bg-slate-800 shrink-0 cursor-pointer"
              >
                <Image
                  src={image || "/images/userImage.webp"}
                  alt="User Avatar"
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
                  <HiCamera className="text-white w-7 h-7" />
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-white">Profile Photo</h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    JPG, PNG or WEBP. Max size 800KB.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition active:scale-95 shadow-md shadow-blue-500/20"
                  >
                    <HiArrowUpTray className="w-4 h-4" />
                    Upload New
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition border border-red-500/20"
                  >
                    <HiTrash className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1C2745] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500"
                  placeholder="Full Name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1C2745] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#1C2745] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition resize-none placeholder:text-slate-500"
                rows={4}
                placeholder="Tell readers a bit about yourself..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition active:scale-95 shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Spinner /> : "Save Profile"}
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}