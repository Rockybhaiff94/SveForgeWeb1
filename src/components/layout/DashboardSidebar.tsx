"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User,
    Server,
    BarChart3,
    Bell,
    Settings,
    LogOut,
    LayoutDashboard,
    ArrowLeft,
    CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const DASHBOARD_ITEMS = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Servers", href: "/dashboard/servers", icon: Server },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ className, user }: { className?: string, user: any }) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard' && pathname !== '/dashboard') return false;
        return pathname.startsWith(href);
    };

    return (
        <aside className={cn("w-64 border-r border-white/10 bg-[#050505] h-screen sticky top-0 flex flex-col hidden lg:flex", className)}>
            <div className="p-6">
                <Link href="/home" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
                        <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    </div>
                    <span className="font-bold text-sm text-gray-400 group-hover:text-white transition-colors">Back to Site</span>
                </Link>
            </div>

            <div className="flex-1 px-4 py-2 space-y-8 overflow-y-auto">
                <div>
                    <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dashboard Menu</p>
                    <nav className="space-y-1">
                        {DASHBOARD_ITEMS.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm transition-all group border",
                                        active
                                            ? "bg-gradient-to-r from-[#3B82F6]/15 to-[#6366f1]/15 border-[#6366f1]/40 rounded-xl shadow-[0_0_12px_rgba(99,102,241,0.25)] text-white font-medium"
                                            : "border-transparent text-white/65 hover:bg-white/5 hover:text-white rounded-xl"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-colors",
                                        active ? "text-[#6366f1]" : "text-white/60 group-hover:text-white/80"
                                    )} />
                                    {item.name}
                                </Link>
                            );
                        })}

                        <div className="pt-4 mt-4 border-t border-white/5">
                            <a
                                href="/api/auth/logout"
                                className="flex w-full items-center gap-3 px-3 py-2 text-sm transition-all group border border-transparent text-red-400/80 hover:bg-red-500/10 hover:text-red-400 rounded-xl"
                            >
                                <LogOut className="w-5 h-5 text-red-400/70 group-hover:text-red-400" />
                                Logout
                            </a>
                        </div>
                    </nav>
                </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-[#080808]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#6366f1] p-0.5 shadow-lg shadow-blue-500/20">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover border-2 border-[#050505]" />
                        ) : (
                            <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user?.username || "User"}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user?.role || "Member"}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
