import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayoutWrapper } from "@/components/layout/AppLayoutWrapper";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ServerForge - Premium Game Server Listing",
  description: "Discover, vote, and rating the best game servers on ServerForge.",
};

import { getSessionUser } from "@/lib/auth-util";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-transparent antialiased selection:bg-[#3B82F6]/30 selection:text-white relative`}>
        {/* Background Effects */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#3B82F6] opacity-10 blur-[120px]"></div>
        </div>
        <AppLayoutWrapper user={user}>{children}</AppLayoutWrapper>
      </body>
    </html>
  );
}
