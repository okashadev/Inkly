"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors: Record<string, string> = {};

    if (!email.trim()) validationErrors.email = "Email address is required";
    if (!password) validationErrors.password = "Password is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log(result);

      if (result?.error) {
        if (result.code === "EMAIL_NOT_VERIFIED") {
          toast.error("Please verify your email address before logging in.");
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }

        toast.error("Invalid email or password");
        setErrors({ form: "Invalid email or password. Please try again." });
        return;
      }

      toast.success("Welcome back! Loading workspace...");
      router.push("/user/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md space-y-4 px-2 sm:px-0"
    >
      {/* Back to Home Navigation Button */}
      <div className="flex items-center justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#c2c6d6] hover:text-[#adc6ff] transition-colors py-1.5 px-3 rounded-lg hover:bg-[#171f33]/60 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#adc6ff]" />
          <span>Back to Home</span>
        </Link>
      </div>

      <Card className="bg-[#171f33] text-[#dae2fd] shadow-2xl border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-[#c2c6d6]">
              Login to continue writing and sharing your ideas
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {/* Global Form Error Alert */}
            {errors.form && (
              <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                {errors.form}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <Label className="text-xs text-[#c2c6d6] font-medium">
                Email Address
              </Label>
              <Input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                disabled={loading}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={`bg-[#131b2e] border border-white/10 h-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#adc6ff] rounded-xl placeholder:text-[#5d6883] transition ${
                  errors.email ? "border-red-500 ring-1 ring-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-[#c2c6d6] font-medium">
                  Password
                </Label>
                <Link
                  href="/forget_password"
                  className="text-xs text-[#adc6ff] hover:text-white hover:underline transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="password"
                  name="password"
                  value={password}
                  disabled={loading}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={`bg-[#131b2e] border border-white/10 h-11 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#adc6ff] rounded-xl placeholder:text-[#5d6883] transition ${
                    errors.password ? "border-red-500 ring-1 ring-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#adc6ff] to-[#4d8eff] hover:from-[#9bbaff] hover:to-[#3b7eff] text-black font-semibold h-11 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md shadow-blue-500/10 mt-2"
            >
              {loading ? "Signing In..." : "Login to workspace"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-[#c2c6d6] pt-2 border-t border-white/5">
            Don&rsquo;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#adc6ff] font-medium hover:underline hover:text-white transition"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
