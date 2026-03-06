import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Users, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const TRENDING_SERVERS = [
    {
        name: "Aetherial Network",
        slug: "aetherial-network",
        logoImage: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=100&auto=format&fit=crop",
        players: 482,
        growth: 124,
    },
    {
        name: "Rustopia EU Main",
        slug: "rustopia-eu",
        logoImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=100&auto=format&fit=crop",
        players: 250,
        growth: 86,
    },
    {
        name: "FiveM RP City",
        slug: "fivem-rp",
        logoImage: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=100&auto=format&fit=crop",
        players: 128,
        growth: 65,
    },
    {
        name: "PixelMon Realm",
        slug: "pixelmon-realm",
        logoImage: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=100&auto=format&fit=crop",
        players: 124,
        growth: 52,
    },
    {
        name: "SkyBlock Legends",
        slug: "skyblock-legends",
        logoImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=100&auto=format&fit=crop",
        players: 89,
        growth: 34,
    },
    {
        name: "Ark Ascension PvE",
        slug: "ark-ascension",
        logoImage: null,
        players: 45,
        growth: 21,
    }
];

export function TrendingServers() {
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
            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-5 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {TRENDING_SERVERS.map((server, index) => (
                    <Card
                        key={server.slug}
                        className="min-w-[280px] lg:min-w-[320px] shrink-0 snap-start bg-[#121212] border-white/5 hover:border-orange-500/30 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-black/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] group overflow-hidden relative"
                    >
                        {/* Glow effect in background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors pointer-events-none" />

                        <CardContent className="p-5 flex flex-col items-center text-center relative z-10">
                            <div className="w-20 h-20 rounded-[35%] overflow-hidden border-2 border-white/10 group-hover:border-orange-500/50 mb-4 bg-[#1A1A22] flex items-center justify-center transition-colors">
                                {server.logoImage ? (
                                    <Image src={server.logoImage} alt={server.name} width={80} height={80} className="object-cover w-full h-full" />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-400">{server.name.charAt(0)}</span>
                                )}
                            </div>

                            <Link href={`/server/${server.slug}`} className="hover:text-orange-400 transition-colors w-full">
                                <h3 className="font-bold text-lg text-white truncate mb-1">{server.name}</h3>
                            </Link>

                            <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-sm mb-4">
                                <ArrowUpRight className="w-4 h-4" />
                                +{server.growth}% Growth
                            </div>

                            <div className="flex items-center justify-between w-full mt-auto">
                                <div className="flex items-center gap-1.5 text-gray-400 text-sm bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                                    <Users className="w-4 h-4 text-[#3B82F6]" />
                                    <span>{server.players} Online</span>
                                </div>
                                <Link href={`/server/${server.slug}`}>
                                    <Button size="sm" className="bg-white/10 hover:bg-orange-500 hover:text-white text-gray-300 px-4 transition-all">
                                        Join
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
