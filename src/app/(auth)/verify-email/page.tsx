"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, RefreshCw, KeyRound, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const from = searchParams.get("from");

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number>(from === "register" ? 60 : 0);
  const [resending, setResending] = useState(false);
  const canResend = timer === 0;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
    inputRefs.current[0]?.focus();
  }, [emailParam]);

useEffect(() => {
  if (timer <= 0) return;

  const interval = setInterval(() => {
    setTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [timer]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    if (!email) {
      toast.error("Missing email address. Please try registering again.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Verification failed");
        return;
      }

      toast.success("Email verified successfully! Please log in.");
      router.push(`/login?email=${encodeURIComponent(email)}&verified=true`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;

    try {
      setResending(true);

      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        toast.error(data.message || "Failed to resend code.");
        return;
      }

      toast.success("A new verification code has been sent to your email.");
      setTimer(60);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error(error);
      toast.error("Error resending code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] flex items-center justify-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-[#111c38] border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400"
          >
            <KeyRound className="w-8 h-8" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Verify Your Email
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            We sent a 6-digit verification code to
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-indigo-300 font-medium text-sm">
            <Mail className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-65">{email || "your email"}</span>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-6 relative z-10">
          {/* 6-Digit OTP Boxes */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-[#0b1326] border border-slate-700/80 text-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || otp.join("").length < 6}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.99]"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Verify Email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center relative z-10">
          <p className="text-sm text-slate-400">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || resending}
            className="mt-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            {resending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            {canResend ? (
              "Resend Code"
            ) : (
              `Resend code in ${timer}s`
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b1326] flex items-center justify-center text-slate-400">
        Loading...
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}