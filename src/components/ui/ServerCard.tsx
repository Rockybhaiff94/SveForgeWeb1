import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Users, Server, Flame, Crown, Medal, TrendingUp, Gamepad2, Activity, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServerCardProps {
    server: {
        name?: string;
        serverName?: string;
        slug?: string;
        _id?: string;
        description: string;
        bannerImage: string | null;
        logoImage: string | null;
        tags: string[];
        votes: number;
        ratingAverage: number;
        status: "online" | "offline" | "full";
        players?: number;
        players_max?: number;
        votesLast7Days?: number;
        totalRatings?: number;
        ping?: number; // Optional mock for design
        region?: string; // Optional mock for design
    };
    rank?: number;
    isTrending?: boolean;
    isTopRated?: boolean;
}

export function ServerCard({ server, rank, isTrending, isTopRated }: ServerCardProps) {
    const isGold = rank === 1;
    const isSilver = rank === 2;
    const isBronze = rank === 3;
    const isElite = rank && rank <= 3;

    let borderClass = "border-white/5";
    let glowClass = "hover:shadow-[0_0_30px_rgba(59,130,246,0.08)] group-hover:border-[#3B82F6]/20";

    if (isTopRated && isElite) {
        if (isGold) {
            borderClass = "border-yellow-500/40";
            glowClass = "shadow-[0_0_30px_rgba(234,179,8,0.2)] group-hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] group-hover:border-yellow-400/60";
        } else if (isSilver) {
            borderClass = "border-slate-300/40";
            glowClass = "shadow-[0_0_30px_rgba(203,213,225,0.15)] group-hover:shadow-[0_0_50px_rgba(203,213,225,0.3)] group-hover:border-slate-200/60";
        } else if (isBronze) {
            borderClass = "border-amber-700/40";
            glowClass = "shadow-[0_0_30px_rgba(180,83,9,0.2)] group-hover:shadow-[0_0_50px_rgba(180,83,9,0.4)] group-hover:border-amber-600/60";
        }
    } else if (isTrending && isElite) {
        borderClass = isGold ? "border-orange-500/40" : "border-blue-500/30";
        glowClass = isGold
            ? "shadow-[0_0_30px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] group-hover:border-orange-400/60"
            : "shadow-[0_0_25px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] group-hover:border-blue-400/50";
    }

    return (
        <Card className={`p-0 overflow-hidden flex flex-col h-auto w-full box-border group bg-[#121212] rounded-3xl ${borderClass} ${glowClass} transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-2 relative backdrop-blur-xl saturate-150`}>

            {/* Top Banner Section (fixed height 140px) */}
            <div className="relative h-[140px] w-full rounded-t-3xl z-10 shrink-0">
                <div className="absolute inset-0 overflow-hidden rounded-t-3xl bg-[#050505]">
                    {server.bannerImage ? (
                        <Image
                            src={server.bannerImage}
                            alt={`${server.serverName || server.name} banner`}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.03] opacity-90 block w-full h-[140px]"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] transition-transform duration-200 group-hover:scale-[1.03]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" />
                </div>

                <div className="absolute top-[12px] left-[12px] w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-md bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center z-20 shadow-sm overflow-hidden text-clip">
                    <Gamepad2 className="w-[20px] h-[20px] text-gray-300" />
                </div>

                <div className="absolute top-[12px] right-[12px] z-20">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
                        {server.status === "online" ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                <span className="text-[10px] font-bold text-green-400 tracking-wider">ONLINE</span>
                            </>
                        ) : server.status === "full" ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                                <span className="text-[10px] font-bold text-orange-400 tracking-wider">FULL</span>
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                <span className="text-[10px] font-bold text-red-400 tracking-wider">OFFLINE</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Overlapping Server Icon */}
                <div className="absolute -bottom-[32px] left-[16px] rounded-[30%] overflow-hidden border-4 border-[#121212] bg-[#050505] w-[64px] h-[64px] shadow-lg z-30 flex items-center justify-center box-content">
                    {server.logoImage ? (
                        <Image src={server.logoImage} alt={server.serverName || server.name || "Logo"} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3B82F6]/10 to-[#60A5FA]/10">
                            <Server className="w-8 h-8 text-[#60A5FA]/50" />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <CardContent className="flex flex-col w-full box-border gap-[10px] p-[14px] pt-10 z-10">
                {/* Header Content */}
                <div className="flex justify-between items-start gap-3 w-full">
                    <Link href={`/server/${server.slug || server._id}`} className="hover:text-[#3B82F6] transition-colors flex-1 min-w-0">
                        <h2 className="text-[18px] font-bold truncate text-white tracking-tight leading-tight">{server.serverName || server.name}</h2>
                    </Link>
                    <div className="shrink-0 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.02)] mt-0.5">
                        <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">{server.region || "Global"}</span>
                    </div>
                </div>

                <p className="text-[13px] text-gray-400 line-clamp-2 leading-relaxed w-full">
                    {server.description}
                </p>

                {/* Tags Section */}
                <div className="flex flex-wrap gap-1.5 w-full">
                    {server.tags?.slice(0, 3).map((tag) => (
                        <div key={tag} className="px-2 py-0.5 rounded text-[11px] font-medium text-gray-300 bg-white/5 border border-white/5 tracking-wide">
                            {tag}
                        </div>
                    ))}
                    {server.tags?.length > 3 && (
                        <div className="px-2 py-0.5 rounded text-[11px] font-medium text-gray-300 bg-white/5 border border-white/5 tracking-wide">
                            +{server.tags.length - 3}
                        </div>
                    )}
                </div>

                {/* Single Horizontal Stats Row */}
                <div className="flex flex-row flex-wrap items-center justify-between text-[11px] font-medium text-gray-300 w-full bg-black/20 p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-1" title="Online Players">
                        <Users className="w-4 h-4 text-[#3B82F6]" />
                        <span>{server.players ?? 0}</span>
                    </div>
                    
                    <div className="flex items-center gap-1" title="Server Ping">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>{server.ping || "32ms"}</span>
                    </div>
                    
                    <div className="flex items-center gap-1" title="Rating">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
                        <span>{server.ratingAverage.toFixed(1)}</span>
                    </div>

                    <div className="flex items-center gap-1" title="Votes">
                        <Crown className="w-4 h-4 text-purple-400" />
                        <span>{server.votes.toLocaleString("en-US")}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row gap-[10px] w-full mt-[8px]">
                    <Link href={`/server/${server.slug || server._id}`} className="flex-1 w-full">
                        <Button
                            className="w-full h-10 rounded-md bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-[13px] tracking-wide transition-all border-none shadow-none hover:shadow-[0_4px_14px_rgba(34,197,94,0.39)] uppercase"
                        >
                            JOIN
                        </Button>
                    </Link>
                    <Link href={`/vote/${server.slug || server._id}`} className="flex-1 w-full">
                        <Button
                            className="w-full h-10 rounded-md bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-[13px] tracking-wide transition-all border-none shadow-none hover:shadow-[0_4px_14px_rgba(88,101,242,0.39)] uppercase"
                        >
                            VOTE
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
