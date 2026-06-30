"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: Record<string, string> = {};

    // required fields validation
    if (!formData.name.trim()) validationErrors.name = "Name is required";
    if (!formData.username.trim())
      validationErrors.username = "Username is required";
    if (!formData.email.trim())
      validationErrors.email = "Email address is required";
    if (!formData.password) validationErrors.password = "Password is required";
    if (!formData.confirmPassword)
      validationErrors.confirmPassword = "Please confirm your password";

    // Password length
    if (formData.password && formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    // Password Match
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
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
          name: formData.name,
          username: formData.username,
          email: formData.email,
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

      toast.success("Account created successfully! Logging you in...");

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.warning(
          "Account created but automatic login failed. Please sign in manually.",
        );
        router.push("/login");
        return;
      }

      router.push("/user/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="bg-[#171f33] text-[#dae2fd] shadow-2xl border-none rounded-2xl">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="text-sm text-[#c2c6d6]">
              Sign up to start writing and sharing your ideas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-2 text-[#c2c6d6]">Full Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`bg-[#131b2e] border-none mt-1 focus:ring-2 focus:ring-[#adc6ff] ${
                    errors.name ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label className="text-xs mb-2 text-[#c2c6d6]">Username</Label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={`bg-[#131b2e] border-none mt-1 focus:ring-2 focus:ring-[#adc6ff] ${
                    errors.username ? "ring-2 ring-red-500" : ""
                  }`}
                />
                {errors.username && (
                  <p className="text-xs text-red-400 mt-1">{errors.username}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label className="text-xs mb-2 text-[#c2c6d6]">
                Email Address
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`bg-[#131b2e] border-none mt-1 focus:ring-2 focus:ring-[#adc6ff] ${
                  errors.email ? "ring-2 ring-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-2 text-[#c2c6d6]">Password</Label>
                <div className="relative mt-1">
                  <Input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`bg-[#131b2e] border-none mt-1 focus:ring-2 focus:ring-[#adc6ff] ${
                      errors.password ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label className="text-xs mb-2 text-[#c2c6d6]">Confirm</Label>
                <div className="relative mt-1">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`bg-[#131b2e] border-none mt-1 focus:ring-2 focus:ring-[#adc6ff] ${
                      errors.confirmPassword ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black font-semibold py-3 rounded-xl hover:opacity-90 transition"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          {/* <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#424754]" />
            <span className="text-xs text-[#8c909f]">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-[#424754]" />
          </div> */}

          {/* Social */}
          {/* <div className="flex gap-4">
            <Button className="w-full bg-[#131b2e] hover:bg-[#2d3449] border-none">
              Google
            </Button>
          </div> */}

          {/* Footer */}
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#adc6ff] cursor-pointer hover:underline"
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
