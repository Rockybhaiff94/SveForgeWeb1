import React from "react";
import { ServerCard } from "@/components/ui/ServerCard";
import { Button } from "@/components/ui/button";
import { Filter, SortDesc, TrendingUp } from "lucide-react";
import { AutoRefresh } from "@/components/ui/AutoRefresh";

// Mock data for initial UI rendering
const MOCK_SERVERS = [
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
    },
    {
        name: "SkyBlock Legends",
        slug: "skyblock-legends",
        description: "Classic SkyBlock with a twist. Custom generators, minions, dungeons, and boss fights.",
        bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Skyblock", "Dungeons", "Economy"],
        votes: 1205,
        ratingAverage: 4.2,
        status: "online" as const,
        players: 38,
    },
    {
        name: "Rustopia EU Main",
        slug: "rustopia-eu",
        description: "Vanilla Rust experience. Weekly wipes, active admins, no playing admins. Survive if you can.",
        bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Vanilla", "PvP", "Weekly"],
        votes: 5621,
        ratingAverage: 4.9,
        status: "online" as const,
        players: 250,
    },
    {
        name: "FiveM Roleplay City",
        slug: "fivem-rp",
        description: "Serious RP server. Custom scripts, active police/ems, player-owned businesses.",
        bannerImage: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Roleplay", "Economy", "Custom Cars"],
        votes: 432,
        ratingAverage: 3.8,
        status: "offline" as const,
        players: 0,
    },
    {
        name: "Ark Ascension PvE",
        slug: "ark-ascension",
        description: "Friendly PvE cluster. 5x harvesting, 10x breeding. All maps connected.",
        bannerImage: null,
        logoImage: null,
        tags: ["PvE", "Cluster", "Boosted"],
        votes: 890,
        ratingAverage: 4.6,
        status: "online" as const,
        players: 45,
    }
];

export default function DiscoverPage() {
    return (
        <div className="space-y-8">
            <AutoRefresh intervalMs={60000} />
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-[#3B82F6]" />
                        Discover Servers
                    </h1>
                    <p className="text-[#9CA3AF] mt-2">Discover the most popular community-voted servers this week.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <SortDesc className="w-4 h-4 mr-2" />
                        Sort By
                    </Button>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_SERVERS.map((server) => (
                    <ServerCard key={server.slug} server={server} />
                ))}
            </div>
        </div>
    );
}
