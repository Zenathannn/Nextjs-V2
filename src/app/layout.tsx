// layout.tsx (Server Component)
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ClientLayout from "@/components/layout/Clientlayout";
// import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper"; // pakai salah satu saja

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ metadata TANPA viewport
export const metadata: Metadata = {
  title: "NEXTJS23 - Aplikasi dengan NextJS 16 dan TailwindCSS",
  description:
    "Aplikasi contoh yang di bangun dengan NextJS 16, TailwindCSS, dan berbagai fitur seperti Server Component, Client Component, API Routes, dan Realtime Database",
  manifest: "/manifest.json",
};

// ✅ viewport dipisah (INI YANG BENAR)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ pakai salah satu saja */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}