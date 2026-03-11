import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth-util";
import { Bell, ShieldCheck, Zap, AlertTriangle, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function NotificationsPage() {
    const user = await getSessionUser();

    if (!user) {
        redirect("/login");
    }

    const notifications = [
        {
            id: 1,
            type: "success",
            title: "Server Approved",
            message: "Your server 'Hypixel Network' has been verified and is now live on the listings.",
            time: "2 hours ago",
            icon: ShieldCheck,
            color: "text-green-400",
            bg: "bg-green-400/10"
        },
        {
            id: 2,
            type: "alert",
            title: "Performance Spike",
            message: "Your server received 500+ votes in the last hour! Great job growing your community.",
            time: "5 hours ago",
            icon: Zap,
            color: "text-orange-400",
            bg: "bg-orange-400/10"
        },
        {
            id: 3,
            type: "warning",
            title: "Bump Available",
            message: "It's been 24 hours since your last bump. Use the bump feature to get back to the top!",
            time: "1 day ago",
            icon: AlertTriangle,
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            id: 4,
            type: "message",
            title: "Community Feedback",
            message: "You have 3 new ratings waiting for your review on 'Mineplex'.",
            time: "2 days ago",
            icon: MessageSquare,
            color: "text-purple-400",
            bg: "bg-purple-400/10"
        },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex justify-between items-center bg-[#0B0B0F] p-8 rounded-[28px] border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-600 opacity-[0.02]"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Bell className="w-8 h-8 text-blue-500" /> Notifications
                    </h1>
                    <p className="text-gray-400 mt-1">Stay updated with your server status and community alerts.</p>
                </div>
                <button className="relative z-10 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-white/10">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div key={notif.id} className="glass-panel p-6 rounded-3xl border border-white/5 hover:bg-white/[0.02] transition-all group flex gap-6 relative overflow-hidden">
                        <div className={cn("inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-white/10 flex-shrink-0 transition-transform group-hover:rotate-6", notif.bg)}>
                            <notif.icon className={cn("w-6 h-6", notif.color)} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-md font-bold text-white">{notif.title}</h4>
                                <span className="text-[10px] items-center flex gap-1 font-bold text-gray-600 uppercase tracking-widest">
                                    <Clock className="w-3 h-3" /> {notif.time}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">{notif.message}</p>
                            <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400">View Details</button>
                                <button className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-gray-400">Dismiss</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center py-10 opacity-30">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em]">End of notifications</p>
            </div>
        </div>
    );
}
