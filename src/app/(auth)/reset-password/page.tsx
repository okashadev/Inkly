"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/home/Spinner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!token || !email) {
      setError("Invalid or missing reset token details.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setMessage(data.message || "Password updated successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0b1326] text-white p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-4"
        >
          <Card className="bg-[#171f33] text-[#dae2fd] shadow-2xl border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <Lock size={20} />
              </div>
              <h2 className="text-2xl font-bold text-white">Invalid Reset Link</h2>
              <p className="text-sm text-[#c2c6d6]">
                This password reset link is invalid or missing required details. Please request a new link.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center w-full h-11 bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black font-semibold rounded-xl hover:opacity-90 transition mt-2"
              >
                Request New Link
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0b1326] text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-4"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#c2c6d6] hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>


        <Card className="bg-[#171f33] text-[#dae2fd] shadow-2xl border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Set New Password
              </h2>
              <p className="text-sm text-[#c2c6d6] leading-relaxed">
                Set a secure new password for{" "}
                <span className="text-[#adc6ff] font-medium">{email}</span>
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="text-xs font-medium mb-2 text-[#c2c6d6] block">
                  New Password
                </Label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  className="bg-[#131b2e] border border-white/10 h-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#adc6ff] rounded-xl placeholder:text-[#5d6883] transition"
                />
              </div>

              <div>
                <Label className="text-xs font-medium mb-2 text-[#c2c6d6] block">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  className="bg-[#131b2e] border border-white/10 h-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#adc6ff] rounded-xl placeholder:text-[#5d6883] transition"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0b1326]">
          <div className="text-xl font-bold text-white font-manrope flex justify-center items-center gap-4">
            <Spinner />
            Inkly
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}