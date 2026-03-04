import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Server, Users, Star, MessageSquare, AlertTriangle, Shield, Globe, Disc, Copy, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Mock data (server fetching would normally happen here)
const mockServer = {
    name: "Aetherial Network",
    slug: "aetherial-network",
    description: `# Welcome to Aetherial Network
  
Aetherial Network is a premium survival multiplayer server offering a unique blend of custom mechanics and pure vanilla vibes.

## Features
- **Custom Enchants**: Over 50 unique enchantments
- **Economy**: Balanced player-driven economy
- **Events**: Weekly tournaments and drop parties
- **Community**: Friendly, non-toxic environment

Join today and start your adventure!`,
    bannerImage: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1000&auto=format&fit=crop",
    logoImage: null,
    tags: ["Survival", "Economy", "Custom Enchants"],
    votes: 14592,
    ratingAverage: 4.8,
    serverIP: "play.aetherial.net",
    port: 25565,
    websiteURL: "https://aetherial.net",
    discordURL: "https://discord.gg/aetherial",
    status: "online" as const,
    players: 482,
};

export default function ServerDetailPage({ params }: { params: { slug: string } }) {
    // In a real app, fetch server by slug here
    const server = mockServer;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Banner & Logo Header */}
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden glass-panel">
                {server.bannerImage ? (
                    <Image
                        src={server.bannerImage}
                        alt={`${server.name} banner`}
                        fill
                        className="object-cover opacity-60"
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#121212]" />
                )}

                {/* Gradient Overlay for Text Visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                {/* Header Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-end gap-6">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-black bg-[#121212] shrink-0 shadow-2xl">
                        {server.logoImage ? (
                            <Image src={server.logoImage} alt={server.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2563EB] to-[#3B82F6]">
                                <Server className="w-12 h-12 text-white/50" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{server.name}</h1>
                            {server.status === "online" ? (
                                <Badge variant="success" className="bg-green-500/20 px-3 py-1">
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                                    Online
                                </Badge>
                            ) : (
                                <Badge variant="danger" className="bg-red-500/20 px-3 py-1">Offline</Badge>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300">
                            <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20 backdrop-blur-md">
                                <Star className="w-4 h-4 fill-yellow-500" />
                                {server.ratingAverage.toFixed(1)} Rating
                            </div>
                            <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 backdrop-blur-md">
                                <ChevronUp className="w-4 h-4" />
                                {server.votes.toLocaleString()} Votes
                            </div>
                            {server.status === "online" && (
                                <div className="flex items-center gap-1.5 bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                                    <Users className="w-4 h-4" />
                                    {server.players} Players
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Col: Description & Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 md:p-8 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <MessageSquare className="w-5 h-5 text-[#3B82F6]" /> About Server
                        </h2>
                        <div className="prose prose-invert prose-blue max-w-none">
                            {/* Simplified Markdown rendering for mock */}
                            {server.description.split('\n').map((line, i) => {
                                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
                                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-gray-200">{line.replace('## ', '')}</h2>;
                                if (line.startsWith('- ')) return <li key={i} className="ml-4 text-gray-300">{line.replace('- ', '')}</li>;
                                return <p key={i} className="text-gray-400 my-2">{line}</p>;
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Col: Actions & Meta */}
                <div className="space-y-6">

                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4 mb-2">
                            <Server className="w-5 h-5 text-[#3B82F6]" /> Connect
                        </h3>

                        <div className="bg-[#121212] rounded-xl p-4 border border-white/5 relative group cursor-pointer hover:border-[#3B82F6]/50 transition-colors flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Server IP</p>
                                <p className="text-lg font-mono font-bold text-[#3B82F6] group-hover:text-[#60A5FA]">{server.serverIP}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center group-hover:bg-[#3B82F6]/20 transition-colors">
                                <Copy className="w-5 h-5 text-[#3B82F6]" />
                            </div>
                        </div>

                        <Button variant="glow" size="lg" className="w-full text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                            <ChevronUp className="w-5 h-5 mr-2" /> VOTE FOR THIS SERVER
                        </Button>

                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                            <Button variant="outline" className="w-full text-[#3B82F6] border-[#3B82F6]/20 hover:bg-[#3B82F6]/10">
                                <Globe className="w-4 h-4 mr-2" /> Website
                            </Button>
                            <Button variant="outline" className="w-full text-[#5865F2] border-[#5865F2]/20 hover:bg-[#5865F2]/10">
                                <Shield className="w-4 h-4 mr-2" /> Discord
                            </Button>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-gray-500 mb-4">Categories & Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {server.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-sm px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Button variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Report this Server
                    </Button>

                </div>
            </div>
        </div>
    );
}
