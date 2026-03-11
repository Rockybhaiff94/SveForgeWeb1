"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    User,
    Mail,
    Calendar,
    Disc,
    ShieldCheck,
    Clock,
    Layout,
    Globe,
    Zap,
    BarChart3,
    Server as ServerIcon,
    LogOut,
    ShieldAlert,
    ChevronRight,
    Lock,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/dashboard/CopyButton";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/user/profile');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    router.push("/login");
                }
            } catch (error) {
                console.error("Session check failed", error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, [router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Profile...</p>
            </div>
        );
    }

    if (!user) return null; // router.push handles the redirect

    const discordAvatarUrl = user.discordId && user.avatar
        ? user.avatar // The callback route already stores the full Discord CDN URL
        : `https://ui-avatars.com/api/?name=${user.username}&background=3B82F6&color=fff&bold=true&size=256`;

    const creationDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Join date unavailable';

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            {/* PROFILE HEADER SECTION */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0B0B0F] to-[#050505] p-8 md:p-12 rounded-[32px] border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 opacity-[0.05] blur-[120px] -mr-64 -mt-64 rounded-full"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity"></div>
                        <img
                            src={discordAvatarUrl}
                            alt={user.username}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-4 border-[#3B82F6]/30 object-cover shadow-2xl relative z-10 p-1.5 bg-[#050505]"
                        />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-[#050505] rounded-full z-20 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-3">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                {user.username}
                            </h1>
                            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                Connected with Discord
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-400 text-sm">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <Disc className="w-4 h-4 text-indigo-400" />
                                <span>{user.discordId}</span>
                            </div>
                            <div className="hidden md:block w-1 h-1 bg-white/10 rounded-full"></div>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <Calendar className="w-4 h-4 text-orange-400" />
                                <span>Joined {creationDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <a href="/api/auth/logout" className="w-full">
                            <button className="w-full px-6 py-2.5 bg-white/5 hover:bg-red-500/10 text-white hover:text-red-400 font-bold text-xs uppercase tracking-widest rounded-xl transition-all border border-white/10 hover:border-red-500/20 flex items-center justify-center gap-2">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </a>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-8">
                    {/* ACCOUNT INFORMATION CARD */}
                    <div className="glass-panel p-8 rounded-[28px] border border-white/5 bg-white/[0.01]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <User className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Account Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Username</p>
                                <p className="text-white font-bold">{user.username}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Discord ID</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-white font-bold font-mono">{user.discordId}</p>
                                    <CopyButton text={user.discordId} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Email Address</p>
                                <p className="text-white font-bold">{user.email || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Provider</p>
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <Disc className="w-4 h-4" />
                                    <span className="font-bold">Discord OAuth</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* USER SERVERS SECTION */}
                    <div className="glass-panel p-8 rounded-[28px] border border-white/5 bg-white/[0.01]">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                    <ServerIcon className="w-5 h-5 text-orange-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Your Servers</h3>
                            </div>
                            <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">View All</button>
                        </div>

                        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                                <ServerIcon className="w-8 h-8 text-gray-600" />
                            </div>
                            <h4 className="text-white font-bold mb-1">No servers connected yet</h4>
                            <p className="text-gray-500 text-sm max-w-xs mb-6">Start growing your community by adding your Discord server to our listings.</p>
                            <Link href="/add">
                                <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20">
                                    Register Server
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-8">
                    {/* USAGE STATISTICS SECTION */}
                    <div className="glass-panel p-8 rounded-[28px] border border-white/5 bg-white/[0.01]">
                        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Usage Statistics</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { label: "Servers Connected", value: "0", icon: Layout, color: "text-blue-400", bg: "bg-blue-400/10" },
                                { label: "Analytics Requests", value: "0", icon: BarChart3, color: "text-green-400", bg: "bg-green-400/10" },
                                { label: "Account Tier", value: "Free", icon: Zap, color: "text-orange-400", bg: "bg-orange-400/10" },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-white leading-none">{stat.value}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CONNECTED SERVICES SECTION */}
                    <div className="glass-panel p-8 rounded-[28px] border border-white/5 bg-white/[0.01]">
                        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Connected Services</h3>
                        <div className="p-4 rounded-2xl bg-[#5865F2]/5 border border-[#5865F2]/20 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#5865F2] flex items-center justify-center shadow-lg shadow-[#5865F2]/20">
                                <Disc className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white">Discord</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest leading-none">Connected</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECURITY SECTION */}
                    <div className="glass-panel p-8 rounded-[28px] border border-white/5 bg-white/[0.01]">
                        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Security</h3>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                                    <Lock className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Login Method</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Discord OAuth 2.0</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <Globe className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Active Session</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Current Browser</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Last Login</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Today</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DANGER ZONE SECTION */}
                    <div className="glass-panel p-8 rounded-[28px] border border-red-500/10 bg-red-500/[0.01]">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldAlert className="w-5 h-5 text-red-500" />
                            <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest">Danger Zone</h3>
                        </div>
                        <div className="space-y-3">
                            <a href="/api/auth/logout" className="block">
                                <button className="w-full py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/20 hover:border-red-500/40">
                                    Log out of all sessions
                                </button>
                            </a>
                            <button className="w-full py-2.5 bg-transparent hover:bg-red-600 hover:text-white text-red-600/60 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-600/20 hover:border-red-600/50">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
