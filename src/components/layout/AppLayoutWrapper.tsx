"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // The landing page should be completely full screen.
    const isLandingPage = pathname === "/";

    if (isLandingPage) {
        return <main className="flex-1 w-full min-h-screen relative overflow-x-hidden">{children}</main>;
    }

    return (
        <div className="flex h-screen overflow-hidden w-full">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth pb-24 lg:pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
