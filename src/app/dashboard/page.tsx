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
            {/* WELCOME SECTION */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0B0B0F] to-[#050505] p-8 md:p-12 rounded-[28px] border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600 opacity-[0.03] blur-[100px] -mr-48 -mt-48 rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-600 opacity-[0.03] blur-[100px] -ml-24 -mb-24 rounded-full"></div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
                            <Zap className="w-3 h-3 fill-blue-400" /> User Dashboard
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{user.username}</span> 👋
                        </h1>
                        <p className="text-lg text-gray-400 max-w-xl">
                            Manage your servers, track performance in real-time, and grow your community with ServerForge.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                            <Link href="/add">
                                <button className="px-8 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
                                    <PlusCircle className="w-5 h-5" /> Add New Server
                                </button>
                            </Link>
                            <Link href="/dashboard/servers">
                                <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 flex items-center gap-2 group">
                                    <List className="w-5 h-5" /> View Listings <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=3B82F6&color=fff&bold=true&size=200`}
                            alt={user.username}
                            className="w-48 h-48 md:w-56 md:h-56 rounded-[40px] border-4 border-[#3B82F6]/30 object-cover shadow-2xl relative z-10 p-2 bg-[#050505]"
                        />
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
