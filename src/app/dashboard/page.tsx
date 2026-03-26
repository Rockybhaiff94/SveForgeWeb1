"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Zap,
    PlusCircle,
    List,
    ChevronRight,
    Edit,
    BarChart3,
    ArrowRight,
    Bell,
    ShieldCheck,
    ArrowUpCircle,
    User as UserIcon,
    Mail,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardServerList } from "@/components/dashboard/DashboardServerList";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/user/profile');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Session check failed", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // STEP 4 - Show Loading Spinner
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Verifying Session...</p>
            </div>
        );
    }

    // STEP 4 - Show Login Button if not logged in
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <ShieldCheck className="w-10 h-10 text-red-400 opacity-50" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Access Restricted</h2>
                    <p className="text-gray-400 max-w-xs">You must be logged in to access the dashboard features.</p>
                </div>
                <Link href="/api/auth/discord">
                    <button className="px-8 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#5865F2]/20 flex items-center gap-2">
                        Login with Discord
                    </button>
                </Link>
            </div>
        );
    }

    // STEP 4 - Show Dashboard Content if logged in
    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* SERVER DASHBOARD HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 pb-2 border-b border-white/5">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-white tracking-tighter italic">SERVER DASHBOARD</h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Manage your survival instance</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        <button className="px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-500/20">Console</button>
                        <button className="px-6 py-2 text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">Public Listing</button>
                        <button className="px-6 py-2 text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">Monetization</button>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/5 border border-green-500/10">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-[pulse_2s_infinite]"></div>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Online</span>
                    </div>
                </div>
            </div>

            {/* WELCOME SECTION (MINIMIZED) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0B0B0F] to-[#050505] p-8 rounded-[28px] border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600 opacity-[0.03] blur-[100px] -mr-48 -mt-48 rounded-full"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=3B82F6&color=fff&bold=true`}
                                alt=""
                                className="w-16 h-16 rounded-2xl border border-white/10 relative z-10 p-1 bg-[#050505]"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">Welcome back, {user.username}!</h2>
                            <p className="text-sm text-gray-500">Your server instance is running smoothly on our globally distributed network.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/add">
                            <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10">Add Server</button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* STATS OVERVIEW */}
            <DashboardStats />

            {/* MY SERVERS SECTION */}
            <DashboardServerList />

            {/* LOWER GRID: ANALYTICS + PANELS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AnalyticsChart />
                </div>

                <div className="space-y-8">
                    {/* QUICK ACTION PANEL */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.01]">
                        <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                            <Zap className="w-4 h-4 text-orange-500" /> Quick Actions
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { name: "Add New Server", icon: PlusCircle, href: "/add", color: "text-blue-400", bg: "hover:bg-blue-500/10" },
                                { name: "Update Server", icon: Edit, href: "/dashboard/servers", color: "text-orange-400", bg: "hover:bg-orange-500/10" },
                                { name: "Promote Server", icon: Zap, href: "/promote", color: "text-purple-400", bg: "hover:bg-purple-500/10" },
                                { name: "View Analytics", icon: BarChart3, href: "/dashboard/analytics", color: "text-green-400", bg: "hover:bg-green-500/10" },
                            ].map((action, i) => (
                                <Link key={i} href={action.href}>
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl border border-transparent transition-all group hover:border-white/5 bg-white/[0.02] hover:bg-white/[0.05]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                <action.icon className={cn("w-4 h-4", action.color)} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{action.name}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-all transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ACCOUNT SETTINGS SHORTCUT */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/10 to-transparent relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <UserIcon className="w-20 h-20 -mr-4 -mt-4 text-blue-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 p-1">
                                    <img src={user.avatar || ""} alt="" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-md font-bold text-white truncate max-w-[120px]">{user.username}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user.role || 'Member'}</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Mail className="w-3 h-3" /> {user.email || 'No email provided'}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <ShieldCheck className="w-3 h-3" /> Account Verified
                                </div>
                            </div>
                            <Link href="/dashboard/profile">
                                <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all shadow-[0_4px_10px_rgba(59,130,246,0.3)]">
                                    Edit Profile
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
