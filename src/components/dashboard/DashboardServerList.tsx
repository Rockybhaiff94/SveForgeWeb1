"use client";

import React from "react";
import { Star, MessageSquare, ArrowUpCircle, Edit3, Eye, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";

const myServers = [
    {
        id: "1",
        name: "Hypixel Network",
        type: "Minecraft / Mini-Games",
        status: "Online",
        players: "12,450",
        votes: "2,430",
        rating: "4.9",
        logo: "https://api.dicebear.com/7.x/shapes/svg?seed=hypixel&backgroundColor=b6e3f4",
    },
    {
        id: "2",
        name: "Mineplex",
        type: "Minecraft / Survival",
        status: "Online",
        players: "8,200",
        votes: "1,120",
        rating: "4.7",
        logo: "https://api.dicebear.com/7.x/shapes/svg?seed=mineplex&backgroundColor=ffdfbf",
    },
    {
        id: "3",
        name: "Wynncraft",
        type: "Minecraft / RPG",
        status: "Offline",
        players: "0",
        votes: "890",
        rating: "4.8",
        logo: "https://api.dicebear.com/7.x/shapes/svg?seed=wynncraft&backgroundColor=c1f4c1",
    },
];

export function DashboardServerList() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-orange-500" /> My Servers
                </h3>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{myServers.length} Servers Total</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myServers.map((server) => (
                    <div
                        key={server.id}
                        className="group bg-white/[0.03] border border-white/[0.06] rounded-[14px] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:border-white/[0.1] hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                                    <img src={server.logo} alt={server.name} className="w-8 h-8 object-contain" />
                                </div>
                                <div className="max-w-[140px]">
                                    <h4 className="font-bold text-white text-lg truncate mb-0.5">{server.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest truncate">{server.type}</p>
                                </div>
                            </div>
                            <div className={`text-[10px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest ${server.status === 'Online'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.1)]'
                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                {server.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                            <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex flex-col items-center justify-center transition-colors group-hover:bg-white/[0.04]">
                                <span className="text-sm font-bold text-white">{server.votes}</span>
                                <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Votes</span>
                            </div>
                            <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex flex-col items-center justify-center transition-colors group-hover:bg-white/[0.04]">
                                <span className="text-sm font-bold text-white flex items-center gap-1">
                                    {server.rating} <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                                </span>
                                <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Rating</span>
                            </div>
                        </div>

                        <div className="flex gap-2 relative z-10">
                            <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all border border-white/10 flex items-center justify-center gap-2">
                                <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all border border-white/10 flex items-center justify-center gap-2">
                                <Eye className="w-3 h-3" /> View
                            </button>
                            <button className="p-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-lg transition-all flex items-center justify-center group/btn shadow-[0_0_10px_rgba(245,158,11,0.05)]">
                                <ArrowUpCircle className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
