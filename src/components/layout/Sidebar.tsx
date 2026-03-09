"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Flame, TrendingUp, PlusCircle, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Discover", href: "/discover", icon: Compass },
    { name: "Trending", href: "/trending", icon: Flame },
    { name: "Top Rated", href: "/top", icon: TrendingUp },
    { name: "Add Server", href: "/add", icon: PlusCircle, highlight: true },
];

const SECONDARY_ITEMS = [
    { name: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Admin", href: "/admin", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/home') return pathname === '/home';
        return pathname.startsWith(href);
    };

    return (
        <aside className={cn("w-64 border-r border-white/10 bg-[#050505] h-screen sticky top-0 flex flex-col hidden lg:flex", className)}>
            <div className="p-6">
                <Link href="/home" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <span className="font-bold text-white text-lg">S</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">ServerForge</span>
                </Link>
            </div>

            <div className="flex-1 px-4 py-2 space-y-8 overflow-y-auto">
                <div>
                    <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</p>
                    <nav className="space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm transition-all group border",
                                        active
                                            ? "bg-gradient-to-r from-[#3B82F6]/15 to-[#6366f1]/15 border-[#6366f1]/40 rounded-xl shadow-[0_0_12px_rgba(99,102,241,0.25)] text-white font-medium"
                                            : "border-transparent text-white/65 hover:bg-white/5 hover:text-white rounded-xl",
                                        !active && item.highlight && "text-[#3B82F6] hover:bg-[#3B82F6]/10 border-transparent"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-colors",
                                        active ? "text-[#6366f1]" : "text-white/60 group-hover:text-white/80",
                                        !active && item.highlight && "text-[#3B82F6]"
                                    )} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</p>
                    <nav className="space-y-1">
                        {SECONDARY_ITEMS.map((item) => {
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
                    </nav>
                </div>
            </div>

            <div className="p-4 border-t border-white/10">
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                    <h4 className="text-sm font-semibold text-white mb-1">Premium Listing</h4>
                    <p className="text-xs text-[#9CA3AF] mb-3">Stand out from the crowd and get more players.</p>
                    <button className="w-full py-1.5 bg-[#F97316] hover:bg-[#F97316]/90 text-white text-xs font-bold rounded-lg shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all transform hover:-translate-y-0.5">
                        Upgrade
                    </button>
                </div>
            </div>
        </aside>
    );
}
