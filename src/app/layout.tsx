import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ServerForge - Premium Game Server Listing",
  description: "Discover, vote, and rating the best game servers on ServerForge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-transparent antialiased selection:bg-blue-500/30 selection:text-blue-200`}>
        <AuthProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth pb-24 lg:pb-8">
                {children}
              </main>
            </div>
          </div>
          <Toaster position="bottom-right" theme="dark" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
