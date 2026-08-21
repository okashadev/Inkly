"use client";
import CTA from "@/components/home/CTA";
import Featured from "@/components/home/Featured";
import Hero from "@/components/home/Hero";
import Spinner from "@/components/home/Spinner";
import WhyInkly from "@/components/home/WhyInkly";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const user = session?.user;

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
    <div className="bg-[#0b1326] text-white min-h-screen">
      <Navbar />
      <main className="pt-18">
        <Hero />
        <Featured />
        {!user && (
          <>
            <WhyInkly />
            <CTA />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
