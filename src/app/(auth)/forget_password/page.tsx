"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Spinner from "@/components/home/Spinner";

const ForgotPasswordPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setMessage(null);

    try {
      setLoading(true);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset email.");
      }

      setIsSuccessMessage(data.success !== false);
      setMessage(
        data.message ||
          "Password reset link has been sent. Please check your inbox and spam folder.",
      );

      setTimeout(() => {
        setMessage(null);
      }, 5000);

      setEmail("");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message || "Failed to send reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold text-white font-manrope flex justify-center items-center gap-4">
          <Spinner />
          Inkly
        </div>
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
        {/* Top Navigation - Back to Home */}
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

        {/* Main Card */}
        <Card className="bg-[#171f33] text-[#dae2fd] shadow-2xl border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          <CardContent className="p-8 space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Forgot Your Password?
              </h2>
              <p className="text-sm text-[#c2c6d6] leading-relaxed">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </div>

            {message && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                  isSuccessMessage
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                }`}
              >
                {isSuccessMessage ? (
                  <CheckCircle2 size={16} className="shrink-0" />
                ) : (
                  <AlertCircle size={16} className="shrink-0" />
                )}
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <Label className="text-xs font-medium mb-2 text-[#c2c6d6]">
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="you@example.com"
                  className={`bg-[#131b2e] border border-white/10 h-11 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#adc6ff] rounded-xl placeholder:text-[#5d6883] transition ${
                    error ? "border-red-500 ring-1 ring-red-500" : ""
                  }`}
                />
                {error && (
                  <p className="text-xs text-red-400 mt-1 font-medium">
                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span>Sending Link...</span>
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            {/* Card Footer Back Action */}
            <div className="pt-2 text-center">
              {status === "authenticated" ? (
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 text-sm text-[#adc6ff] hover:underline font-medium cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-[#adc6ff] hover:underline font-medium cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
