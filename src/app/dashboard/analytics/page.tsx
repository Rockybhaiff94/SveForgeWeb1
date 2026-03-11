import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth-util";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { TrendingUp, Users, Activity, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AnalyticsPage() {
    const user = await getSessionUser();

    if (!user) {
        redirect("/login");
    }

    const detailStats = [
        { label: "Unique Visitors", value: "8.4k", change: "+12.5%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Clicks", value: "24.2k", change: "+8.2%", icon: MousePointer2, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Avg. Session", value: "4m 2s", change: "-2.1%", icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Conversion", value: "3.2%", change: "+0.4%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Performance Analytics</h1>
                <p className="text-gray-400 mt-1">Deep dive into your server statistics and player engagement.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {detailStats.map((stat, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 relative bg-white/[0.01]">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border border-white/10", stat.bg)}>
                                <stat.icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",
                                stat.change.startsWith('+') ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                            )}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-2xl font-black text-white">{stat.value}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <AnalyticsChart />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-[28px] border border-white/5 bg-white/[0.01]">
                    <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Top Referral Sources</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Discord", visits: "4.2k", share: "50%" },
                            { name: "Direct", visits: "2.1k", share: "25%" },
                            { name: "Google Search", visits: "1.3k", share: "15%" },
                            { name: "Other Sites", visits: "0.8k", share: "10%" },
                        ].map((ref, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400">{ref.name}</span>
                                    <span className="text-white">{ref.visits} ({ref.share})</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: ref.share }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-[28px] border border-white/5 bg-white/[0.01]">
                    <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Player Demographics</h3>
                    <div className="flex items-center justify-center p-8 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                        <p className="text-sm text-center text-gray-400">
                            Detailed player geography and connection analytics are available for <span className="text-blue-400 font-bold">Premium Plus</span> users.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
