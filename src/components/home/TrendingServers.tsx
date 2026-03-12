"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Users, ArrowUpRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function TrendingServers() {
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrendingServers = async () => {
             try {
                 const res = await fetch('/api/servers?sortBy=trending&limit=8', {
                     next: { revalidate: 60 }
                 });
                 if (res.ok) {
                     const data = await res.json();
                     setServers(data.servers || []);
                 }
             } catch (err) {
                 console.error("Failed to fetch trending servers:", err);
             } finally {
                 setLoading(false);
             }
        };

        fetchTrendingServers();
    }, []);

    return (
        <section className="mt-16">
            <div className="flex justify-between items-end mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                        <TrendingUp className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-white tracking-tight">Trending Servers</h2>
                        <p className="text-gray-400 text-sm mt-1">Servers gaining popularity fast.</p>
                    </div>
                </div>

                <Link href="/trending" className="hidden sm:block text-[#3B82F6] hover:text-[#2563EB] text-sm font-semibold transition-colors">
                    View All &rarr;
                </Link>
            </div>

            {/* Horizontal Scroll Container */}
            {loading ? (
                 <div className="flex justify-center items-center py-12">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                 </div>
            ) : servers.length === 0 ? (
                 <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-2xl w-full">
                     <p className="text-gray-400">No servers available yet.</p>
                 </div>
            ) : (
                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-5 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {servers.map((server, index) => (
                        <Card
                            key={server._id || index}
                            className="min-w-[280px] lg:min-w-[320px] shrink-0 snap-start bg-[#121212] border-white/5 hover:border-orange-500/30 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-black/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] group overflow-hidden relative"
                        >
                            {/* Glow effect in background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors pointer-events-none" />

                            <CardContent className="p-5 flex flex-col items-center text-center relative z-10">
                                <div className="w-20 h-20 rounded-[35%] overflow-hidden border-2 border-white/10 group-hover:border-orange-500/50 mb-4 bg-[#1A1A22] flex items-center justify-center transition-colors">
                                    {server.logoImage ? (
                                        <Image src={server.logoImage} alt={server.serverName} width={80} height={80} className="object-cover w-full h-full" />
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-400">{server.serverName?.charAt(0) || '?'}</span>
                                    )}
                                </div>

                                <Link href={`/server/${server.slug || server._id}`} className="hover:text-orange-400 transition-colors w-full">
                                    <h3 className="font-bold text-lg text-white truncate mb-1">{server.serverName || server.name}</h3>
                                </Link>

                                <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-sm mb-4">
                                    <ArrowUpRight className="w-4 h-4" />
                                    +{(server.votesLast7Days * 2 || 12)} Growth {/* Simulated from votes/activity */}
                                </div>

                                <div className="flex items-center justify-between w-full mt-auto">
                                    <div className="flex items-center gap-1.5 text-gray-400 text-sm bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                                        <Users className="w-4 h-4 text-[#3B82F6]" />
                                        <span>{server.players} Online</span>
                                    </div>
                                    <Link href={`/server/${server.slug || server._id}`}>
                                        <Button size="sm" className="bg-white/10 hover:bg-orange-500 hover:text-white text-gray-300 px-4 transition-all">
                                            Join
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
