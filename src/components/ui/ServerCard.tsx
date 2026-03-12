import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Users, Server, Flame, Crown, Medal, TrendingUp, Gamepad2, Activity, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ServerCardProps {
    server: {
        name: string;
        slug: string;
        description: string;
        bannerImage: string | null;
        logoImage: string | null;
        tags: string[];
        votes: number;
        ratingAverage: number;
        status: "online" | "offline";
        players?: number;
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
        <Card className={`flex flex-col h-full group bg-[#121212] rounded-3xl ${borderClass} ${glowClass} transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-2 relative backdrop-blur-xl saturate-150`}>

            {/* Top Banner Section (16:9) */}
            <div className="relative aspect-video w-full rounded-t-3xl z-10">
                {/* Background & Image Container with overflow-hidden for rounded corners */}
                <div className="absolute inset-0 overflow-hidden rounded-t-3xl bg-[#050505]">
                    {server.bannerImage ? (
                        <Image
                            src={server.bannerImage}
                            alt={`${server.name} banner`}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.03] opacity-90"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] transition-transform duration-200 group-hover:scale-[1.03]" />
                    )}
                    {/* Banner Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
                </div>

                {/* Game Logo Identifier (Top-Left) */}
                <div className="absolute top-[12px] left-[12px] w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-md bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center z-20 shadow-sm overflow-hidden text-clip">
                    <Gamepad2 className="w-[20px] h-[20px] text-gray-300" />
                </div>

                {/* Status Badge (Top-Right) */}
                <div className="absolute top-[12px] right-[12px] z-20">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10">
                        {server.status === "online" ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                <span className="text-[10px] font-bold text-green-400 tracking-wider">ACTIVE</span>
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                <span className="text-[10px] font-bold text-red-400 tracking-wider">INACTIVE</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Server Logo (Overlapping bottom-left) */}
                <div className="absolute -bottom-6 left-4 rounded-[40%] overflow-hidden border border-[#3B82F6]/30 bg-[#050505] w-[64px] h-[64px] shadow-lg z-30 flex items-center justify-center">
                    {server.logoImage ? (
                        <Image src={server.logoImage} alt={server.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3B82F6]/10 to-[#60A5FA]/10">
                            <Server className="w-8 h-8 text-[#60A5FA]/50" />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <CardContent className="flex flex-col flex-grow pt-9 pb-5 px-5 z-10">
                {/* Main Info Row */}
                <div className="flex justify-between items-start mb-2 gap-3">
                    <Link href={`/server/${server.slug}`} className="hover:text-[#3B82F6] transition-colors flex-1 min-w-0">
                        <h2 className="text-xl font-bold truncate text-white tracking-tight">{server.name}</h2>
                    </Link>
                    {/* Region Badge */}
                    <div className="shrink-0 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.02)]">
                        <span className="text-xs font-semibold text-gray-300 tracking-wide">{server.region || "Global"}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 tracking-wide min-h-[40px]">
                    {server.description}
                </p>

                {/* Type Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {server.tags?.slice(0, 4).map((tag) => (
                        <div key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium text-gray-300">
                            {tag}
                        </div>
                    ))}
                    {server.tags?.length > 4 && (
                        <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium text-gray-300">
                            +{server.tags.length - 4}
                        </div>
                    )}
                </div>

                {/* Spacer to push stats & buttons to bottom if content is short */}
                <div className="flex-grow" />

                {/* Structured Stats Row */}
                <div className="flex items-center justify-between text-xs font-medium text-gray-400 mb-5 bg-black/20 p-2.5 rounded-lg border border-white/5">
                    {/* Left: Players & Ping */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5" title="Online Players">
                            <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
                            <span>{server.players !== undefined ? server.players : 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Server Ping">
                            <Activity className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{server.ping || "32ms"}</span>
                        </div>
                    </div>

                    {/* Right: Rating & Votes */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5" title="Rating">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
                            <span>{server.ratingAverage.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Votes">
                            <Crown className="w-3.5 h-3.5 text-purple-400" />
                            <span>{server.votes.toLocaleString("en-US")}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Link href={`/server/${server.slug}`} className="flex-1">
                        <Button
                            className="w-full h-10 rounded-lg bg-[var(--color-online)] hover:bg-[var(--color-online)] hover:brightness-110 font-bold text-white tracking-wide transition-all duration-200 border-none uppercase shadow-none hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
                        >
                            Join
                        </Button>
                    </Link>
                    <Link href={`/vote/${server.slug}`} className="flex-1">
                        <Button
                            className="w-full h-10 rounded-lg bg-[#3B82F6] hover:bg-[#60A5FA] font-bold text-white tracking-wide transition-all duration-200 border-none uppercase shadow-none hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:-translate-y-0.5"
                        >
                            Vote
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
