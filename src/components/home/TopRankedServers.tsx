import React from "react";
import { ServerCard } from "@/components/ui/ServerCard";
import { Trophy } from "lucide-react";

// Mock data for top ranked servers
const TOP_RANKED_SERVERS = [
    {
        name: "Aetherial Network",
        slug: "aetherial-network",
        description: "Premium survival multiplayer with custom enchants, economy, and regular events. Join our friendly community today!",
        bannerImage: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Survival", "Economy", "Custom Enchants"],
        votes: 14592,
        ratingAverage: 4.8,
        status: "online" as const,
        players: 482,
        ping: 24,
    },
    {
        name: "PixelMon Realm",
        slug: "pixelmon-realm",
        description: "The ultimate Pixelmon experience! Catch, train, and battle your way to the top. Custom tournaments every weekend.",
        bannerImage: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Pixelmon", "Modded", "Tournaments"],
        votes: 8934,
        ratingAverage: 4.5,
        status: "online" as const,
        players: 124,
        ping: 35,
    },
    {
        name: "SkyBlock Legends",
        slug: "skyblock-legends",
        description: "Classic SkyBlock with a twist. Custom generators, minions, dungeons, and boss fights.",
        bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Skyblock", "Dungeons", "Economy"],
        votes: 5621,
        ratingAverage: 4.9,
        status: "online" as const,
        players: 250,
        ping: 18,
    },
    {
        name: "Rustopia EU Main",
        slug: "rustopia-eu",
        description: "Vanilla Rust experience. Weekly wipes, active admins, no playing admins. Survive if you can.",
        bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Vanilla", "PvP", "Weekly"],
        votes: 4321,
        ratingAverage: 4.6,
        status: "online" as const,
        players: 600,
        ping: 42,
    }
];

export function TopRankedServers() {
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TOP_RANKED_SERVERS.map((server, index) => (
                    <div key={server.slug} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        <ServerCard server={server} rank={index + 1} isTopRated />
                    </div>
                ))}
            </div>
        </section>
    );
}
