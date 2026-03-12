"use client";

import React, { useEffect, useState } from "react";
import { Star, MessageSquare, ArrowUpCircle, Edit3, Eye, Globe, PlusCircle, Server as ServerIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastContext";

interface ServerProps {
    _id: string;
    serverName: string;
    gameType: string;
    status: string;
    players: number;
    players_max?: number;
    votes: number;
    ratingAverage: number;
    logoImage?: string;
}

export function DashboardServerList() {
    const [servers, setServers] = useState<ServerProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchMyServers = async () => {
             try {
                 const res = await fetch('/api/servers/user', {
                     headers: {
                         'Cache-Control': 'no-cache, no-store, must-revalidate'
                     }
                 });
                 const data = await res.json();
                 
                 if (res.ok && data.success && Array.isArray(data.servers)) {
                     setServers(data.servers);
                 }
             } catch (err) {
                 console.error("Failed to load user servers", err);
                 toast('error', 'Error Loading Servers', 'Failed to retrieve your server list.');
             } finally {
                 setIsLoading(false);
             }
        };

        fetchMyServers();

        // Implement 60-second polling for live status updates
        const interval = setInterval(fetchMyServers, 60000);
        return () => clearInterval(interval);
    }, [toast]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-6 w-32 bg-white/5 animate-pulse rounded-md" />
                    <div className="h-4 w-24 bg-white/5 animate-pulse rounded-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-[14px] p-5 h-[180px] animate-pulse flex flex-col justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-5 bg-white/5 rounded-md w-3/4" />
                                    <div className="h-3 bg-white/5 rounded-md w-1/2" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <div className="h-[46px] rounded-xl bg-white/5" />
                                <div className="h-[46px] rounded-xl bg-white/5" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-[34px] rounded-lg bg-white/5 flex-1" />
                                <div className="h-[34px] rounded-lg bg-white/5 flex-1" />
                                <div className="h-[34px] w-[34px] rounded-lg bg-white/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (servers.length === 0) {
        return (
             <div className="bg-[#121212]/50 border border-white/[0.05] rounded-3xl p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-blue-500/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative z-10 group-hover:scale-110 transition-transform duration-500">
                    <ServerIcon className="w-10 h-10 text-blue-400" />
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2 relative z-10">No servers added yet</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-8 relative z-10 text-sm leading-relaxed">
                    You haven&apos;t added any servers to ServerForge yet. Start by registering your first game server to climb the community rankings.
                </p>
                
                <Link href="/add" className="relative z-10">
                    <button className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                        <PlusCircle className="w-5 h-5" /> Add Your First Server
                    </button>
                </Link>
             </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" /> My Servers
                </h3>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{servers.length} Servers Total</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servers.map((server) => (
                    <div
                        key={server._id}
                        className="group bg-white/[0.03] border border-white/[0.06] rounded-[14px] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:border-white/[0.1] hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                                    <img src={server.logoImage || `https://api.dicebear.com/7.x/shapes/svg?seed=${server.serverName}&backgroundColor=0f172a`} alt={server.serverName} className="w-full h-full object-cover" />
                                </div>
                                <div className="max-w-[140px]">
                                    <h4 className="font-bold text-white text-lg truncate mb-0.5">{server.serverName}</h4>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest truncate">{server.gameType}</p>
                                </div>
                            </div>
                            <div className={`text-[10px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest ${
                                server.status === 'online'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.1)]'
                                    : server.status === 'full'
                                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.1)]'
                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                                {server.status === 'online' ? 'Online' : server.status === 'full' ? 'Full' : 'Offline'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                            {/* Players Card */}
                            <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex flex-col items-center justify-center transition-colors group-hover:bg-white/[0.04]">
                                <span className="text-sm font-bold text-white">
                                    {server.players} {server.players_max ? `/ ${server.players_max}` : ''}
                                </span>
                                <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Players</span>
                            </div>
                            <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex flex-col items-center justify-center transition-colors group-hover:bg-white/[0.04]">
                                <span className="text-sm font-bold text-white flex items-center gap-1">
                                    {server.ratingAverage ? server.ratingAverage.toFixed(1) : "0.0"} <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                                </span>
                                <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Rating</span>
                            </div>
                        </div>

                        <div className="flex gap-2 relative z-10">
                            <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all border border-white/10 flex items-center justify-center gap-2">
                                <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <Link href={`/server/${server._id}`} className="flex-1">
                                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all border border-white/10 flex items-center justify-center gap-2">
                                    <Eye className="w-3 h-3" /> View
                                </button>
                            </Link>
                            <button aria-label="Bump Server" title="Bump Server" className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-all flex items-center justify-center group/btn shadow-[0_0_10px_rgba(59,130,246,0.05)]">
                                <ArrowUpCircle className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
