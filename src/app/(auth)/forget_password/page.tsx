"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

const page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/user/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0b1326] text-white">
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
                <h2 className="text-3xl font-bold">Forget Your Password?</h2>
                <p className="text-sm text-[#c2c6d6]">
                  Enter your email address and we'll send you a link to reset
                  your password
                </p>
              </div>

              {/* Form */}
              <div className="space-y-5">
                {/* Email */}
                <div>
                  <Label className="text-xs mb-3 text-[#c2c6d6]">
                    Email Address
                  </Label>
                  <Input
                    placeholder="Enter your email"
                    className="bg-[#131b2e] border-none py-2 mt-1 focus:ring-2 focus:ring-[#adc6ff]"
                  />
                </div>

                {/* Button */}
                <Button className="w-full bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black font-semibold py-3 rounded-xl hover:opacity-90 transition">
                  Send Reset Link
                </Button>
              </div>

              <div className="text-center flex justify-center w-full items-center gap-2 text-sm">
                <IoArrowBack />
                <Link href="/login" className="text-[#adc6ff] cursor-pointer">
                   Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default page;
