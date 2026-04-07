"use client";
import RegisterForm from "@/components/auth/RegisterForm";
import { motion } from "framer-motion";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b1326] text-white">
      {/* LEFT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex md:w-1/2 flex-col justify-between p-16 bg-[#060e20]"
      >
        <div className="text-2xl font-bold">Inkly</div>

        <div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Start your writing journey today
          </h1>
          <p className="text-[#c2c6d6] max-w-md">
            Experience the ultimate workspace designed for clarity. Code blocks,
            rich editorial tools, and seamless distribution.
          </p>
        </div>

        <p className="text-sm text-[#8c909f]">
          Join 5,000+ creators building on Inkly
        </p>
      </motion.div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
