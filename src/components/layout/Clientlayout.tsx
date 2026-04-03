"use client";

// components/layout/ClientLayout.tsx
// Pisahkan logika useState ke komponen ini agar layout.tsx tetap Server Component

import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header brandName="My App" onBrandClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
        <Footer />
      </div>
    </div>
  );
}