"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ToastProvider } from "@/components/ui/ToastContext";

export function AppLayoutWrapper({ children, user }: { children: React.ReactNode, user: any }) {
    const pathname = usePathname();

    // The landing page should be completely full screen.
    const isLandingPage = pathname === "/";
    const isDashboard = pathname.startsWith("/dashboard");

    if (isLandingPage) {
        return <main className="flex-1 w-full min-h-screen relative overflow-x-hidden">{children}</main>;
    }

    return (
        <ToastProvider>
            <div className="flex h-screen overflow-hidden w-full">
                {isDashboard ? <DashboardSidebar user={user} /> : <Sidebar user={user} />}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <TopBar user={user} />
                    <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth pb-24 lg:pb-8">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
