"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        alert("Invalid credentials");
        return;
      }

      router.push("/user/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md bg-card text-white shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Login to continue writing and sharing your ideas
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <Label className="mb-4">Email address</Label>
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between">
                <Label className="mb-4">Password</Label>
                <Link
                  href="/forget_password"
                  className="text-xs text-accent cursor-pointer"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black font-medium hover:from-[#4d8eff] hover:to-[#adc6ff] border-none"
            >
              {loading ? "Signing In..." : "Login to workspace"}
            </Button>
          </div>

          {/* <div className="text-center text-sm text-muted-foreground">
            OR CONTINUE WITH
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="w-full">
              Google
            </Button>
          </div> */}

          <div className="text-center text-sm">
            Don’t have an account?{" "}
            <Link href="/register" className="text-accent cursor-pointer">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
