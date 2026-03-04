"use client";

import { useSession } from "next-auth/react";
import { Users, Server, Star, TrendingUp } from "lucide-react";

export default function DashboardPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-[60vh] space-y-4 flex-col">
                <div className="w-16 h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.2)]"></div>
            </div>
        );
    }

    if (!session?.user) return null; // handled by middleware

    // Mock stats for display
    const stats = [
        { label: "Total Servers", value: "3", icon: Server, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10", border: "border-[#3B82F6]/20" },
        { label: "Total Votes", value: "1,245", icon: TrendingUp, color: "text-[#6366f1]", bg: "bg-[#6366f1]/10", border: "border-[#6366f1]/20" },
        { label: "Average Rating", value: "4.8", icon: Star, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/20" },
        { label: "Profile Views", value: "8.5k", icon: Users, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10", border: "border-[#3B82F6]/20" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Dahsboard Overview</h1>
                <p className="text-gray-400">Welcome back, {session.user.username}. Here is what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                            <stat.icon className="w-24 h-24 -mr-8 -mt-8" />
                        </div>
                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center mb-4`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart/Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-6">Traffic & Votes</h3>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-black/20">
                        <p className="text-gray-500">Chart Visualization Placeholder</p>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-6">Recent Server Approvals</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Hypixel Network", date: "2 hours ago", status: "Approved" },
                            { name: "Mineplex", date: "1 day ago", status: "Approved" },
                            { name: "Wynncraft", date: "3 days ago", status: "Pending" },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-white">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.date}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-md border ${item.status === 'Approved'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
