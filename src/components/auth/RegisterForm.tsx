"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const RegisterForm = () => {
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
          <div className="space-y-5">

            {/* Full Name */}
            <div>
              <Label className="text-xs mb-2 text-[#c2c6d6]">Full Name</Label>
              <Input
                placeholder="John Doe"
                className="bg-[#131b2e] border-none mt-1 focus:ring-2 focus:ring-[#adc6ff]"
              />
            </div>

            {/* Email */}
            <div>
              <Label className="text-xs mb-2 text-[#c2c6d6]">Email Address</Label>
              <Input
                placeholder="name@company.com"
                className="bg-[#131b2e] border-none mt-1 focus:ring-2 focus:ring-[#adc6ff]"
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-2 text-[#c2c6d6]">Password</Label>
                <Input
                  type="password"
                  className="bg-[#131b2e] border-none mt-1 focus:ring-2 focus:ring-[#adc6ff]"
                />
              </div>

              <div>
                <Label className="text-xs mb-2 text-[#c2c6d6]">Confirm</Label>
                <Input
                  type="password"
                  className="bg-[#131b2e] border-none mt-1 focus:ring-2 focus:ring-[#adc6ff]"
                />
              </div>
            </div>

            {/* Button */}
            <Button className="w-full bg-linear-to-r from-[#adc6ff] to-[#4d8eff] text-black font-semibold py-3 rounded-xl hover:opacity-90 transition">
              Create account
            </Button>
          </div>

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
            <Link href="/login" className="text-[#adc6ff] cursor-pointer hover:underline">
              Login
            </Link>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  )
}

export default RegisterForm