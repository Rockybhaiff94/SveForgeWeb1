"use client";

import React, { useState, useEffect } from "react";
import { ServerCard } from "@/components/ui/ServerCard";
import { Trophy, Loader2 } from "lucide-react";

export function TopRankedServers() {
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopServers = async () => {
             try {
                 const res = await fetch('/api/servers?sortBy=rating&limit=4', {
                     next: { revalidate: 60 } // Polling cache interval 
                 });
                 if (res.ok) {
                     const data = await res.json();
                     setServers(data.servers || []);
                 }
             } catch (err) {
                 console.error("Failed to fetch top ranked servers:", err);
             } finally {
                 setLoading(false);
             }
        };

        fetchTopServers();
    }, []);

    return (
        <section className="mt-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Top Ranked Servers</h2>
                    <p className="text-gray-400 text-sm mt-1">The highest voted servers by the ServerForge community.</p>
                </div>
            </div>

            {loading ? (
                 <div className="flex justify-center items-center py-20">
                      <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                 </div>
            ) : servers.length === 0 ? (
                 <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <p className="text-gray-400">No servers available yet.</p>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {servers.map((server, index) => (
                        <div key={server.slug} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                            <ServerCard server={server} rank={index + 1} isTopRated />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
