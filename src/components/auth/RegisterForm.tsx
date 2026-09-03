"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateUsername = (username: string) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 30) return "Username cannot exceed 30 characters";
    if (/\s/.test(username)) return "Spaces are not allowed in username";
    if (/-/.test(username))
      return "Hyphens (-) are not allowed, use underscores (_)";

    const regex = /^[a-z0-9_]+(?:\.[a-z0-9_]+)*$/;
    if (!regex.test(username)) {
      return "Only lowercase letters, numbers, underscores, and single dots are allowed";
    }

    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (e.target.name === "username") {
      value = value.toLowerCase();
    }

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));

    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: Record<string, string> = {};

    if (!formData.name.trim()) validationErrors.name = "Name is required";

    const usernameError = validateUsername(formData.username);
    if (usernameError) validationErrors.username = usernameError;

    if (!formData.email.trim()) {
      validationErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);

      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.field) {
          setErrors((prev) => ({ ...prev, [data.field]: data.message }));
        } else {
          toast.error(data.message || "Registration failed");
        }
        return;
      }

      toast.success(
        "Account created! Please check your email for verification code.",
      );

      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      const targetEmail = formData.email.trim();

      router.push(`/verify-email?email=${encodeURIComponent(targetEmail)}&from=register`);
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
      className="w-full max-w-md space-y-4"
    >
      {/* Back to Home Button */}
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
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Create your account
            </h2>
            <p className="text-sm text-[#c2c6d6]">
              Sign up to start writing and sharing your ideas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-[#c2c6d6]">
                  Full Name
                </Label>
                <Input
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`bg-[#131b2e] border-white/10 text-white placeholder:text-gray-500 mt-1 focus:ring-2 focus:ring-[#adc6ff] transition-all ${
                    errors.name ? "ring-2 ring-red-500 border-transparent" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs font-medium text-[#c2c6d6]">
                  Username
                </Label>
                <Input
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe_123"
                  className={`bg-[#131b2e] border-white/10 text-white placeholder:text-gray-500 mt-1 focus:ring-2 focus:ring-[#adc6ff] transition-all ${
                    errors.username
                      ? "ring-2 ring-red-500 border-transparent"
                      : ""
                  }`}
                />
                {errors.username && (
                  <p className="text-xs text-red-400 mt-1 font-medium">
                    {errors.username}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label className="text-xs font-medium text-[#c2c6d6]">
                Email Address
              </Label>
              <Input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`bg-[#131b2e] border-white/10 text-white placeholder:text-gray-500 mt-1 focus:ring-2 focus:ring-[#adc6ff] transition-all ${
                  errors.email ? "ring-2 ring-red-500 border-transparent" : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-[#c2c6d6]">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`bg-[#131b2e] border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#adc6ff] transition-all pr-10 ${
                      errors.password
                        ? "ring-2 ring-red-500 border-transparent"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs font-medium text-[#c2c6d6]">
                  Confirm
                </Label>
                <div className="relative mt-1">
                  <Input
                    name="confirmPassword"
                    autoComplete="new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`bg-[#131b2e] border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#adc6ff] transition-all pr-10 ${
                      errors.confirmPassword
                        ? "ring-2 ring-red-500 border-transparent"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1 font-medium">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-[#c2c6d6] pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#adc6ff] font-medium hover:underline cursor-pointer"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterForm;
