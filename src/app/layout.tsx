import type { Metadata } from "next";
import { Manrope, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Inkly – Blogging Platform",
    template: "%s | Inkly",
  },
  description:
    "Inkly is a modern full-stack blogging platform for creators and readers to publish articles, engage with authors, and share insightful stories.",
  keywords: [
    "blogging platform",
    "articles",
    "tech blogs",
    "writing app",
    "Next.js blog",
    "Inkly",
  ],
  authors: [{ name: "Your Name" }],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Inkly – Full-Stack Blogging Platform",
    description:
      "Publish articles, engage with authors, and discover insightful stories on Inkly.",
    url: "https://inkly-ecru.vercel.app",
    siteName: "Inkly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkly – Blogging Platform",
    description:
      "Publish articles, engage with authors, and discover insightful stories on Inkly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <NextAuthProvider>{children}</NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
