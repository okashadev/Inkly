"use client";
import CTA from "@/components/home/CTA";
import Featured from "@/components/home/Featured";
import Hero from "@/components/home/Hero";
import WhyInkly from "@/components/home/WhyInkly";
import Footer from "@/components/layout/guest/Footer";
import Navbar from "@/components/layout/guest/Navbar";

export default function Home() {
  return (
    <div className="bg-[#0b1326] text-white min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <Featured />
        <WhyInkly />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
