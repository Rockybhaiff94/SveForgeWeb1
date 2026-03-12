"use client";

import React, { useState, useEffect } from "react";
import { Server, TrendingUp, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardStats() {
    const [statsData, setStatsData] = useState({
        totalServers: 0,
        activeServers: 0,
        totalVotes: 0,
        totalViews: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                // First ping the profile check to ensure valid session if needed, but our route handles auth checks
                const res = await fetch('/api/user/dashboard-stats');
                const json = await res.json();
                if (json.success) {
                    setStatsData(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const dynamicStats = [
        {
            label: "Total Servers",
            value: isLoading ? "..." : statsData.totalServers.toLocaleString(),
            icon: Server,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            glow: "shadow-[0_0_15px_rgba(59,130,246,0.1)]"
        },
        {
            label: "Total Votes",
            value: isLoading ? "..." : statsData.totalVotes.toLocaleString(),
            icon: TrendingUp,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
            glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        },
        {
            label: "Total Views",
            value: isLoading ? "..." : statsData.totalViews.toLocaleString(),
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            glow: "shadow-[0_0_15px_rgba(59,130,246,0.1)]"
        },
        {
            label: "Active Servers",
            value: isLoading ? "..." : `${statsData.activeServers} Online`,
            icon: Activity,
            color: "text-green-500",
            bg: "bg-green-500/10",
            border: "border-green-500/20",
            glow: "shadow-[0_0_15px_rgba(34,197,94,0.1)]"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dynamicStats.map((stat, i) => (
                <div
                    key={i}
                    className={cn(
                        "group p-6 rounded-[14px] bg-white/[0.03] border border-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:border-white/[0.1] relative overflow-hidden",
                        stat.glow
                    )}
                >
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border transition-colors", stat.bg, stat.border)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                            <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    </div>
                    {/* Subtle background glow */}
                    <div className={cn("absolute -right-4 -bottom-4 w-24 h-24 opacity-5 blur-2xl rounded-full", stat.bg)}></div>
                </div>
            ))}
        </div>
    );
}
