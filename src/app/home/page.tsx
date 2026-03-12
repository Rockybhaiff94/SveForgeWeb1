import React from "react";
import { Metadata } from "next";
import { FeaturedBanner } from "@/components/home/FeaturedBanner";
import { TopRankedServers } from "@/components/home/TopRankedServers";
import { TrendingServers } from "@/components/home/TrendingServers";
import { ServerCategories } from "@/components/home/ServerCategories";
import { GameServerLists } from "@/components/home/GameServerLists";
import { AutoRefresh } from "@/components/ui/AutoRefresh";

export const metadata: Metadata = {
    title: "Home - ServerForge Discovery",
    description: "Discover the best trending, top-ranked, and fast-growing game servers on ServerForge.",
};

export default function HomePage() {
    return (
        <div className="space-y-0 pb-12 w-full max-w-[1600px] mx-auto">
            <AutoRefresh intervalMs={60000} />
            
            {/* Section 1: Featured Banner / Server News */}
            <FeaturedBanner />

            {/* Section 2: Top Ranked Servers */}
            <TopRankedServers />

            {/* Section 3: Fast Growing / Trending Servers */}
            <TrendingServers />

            {/* Section 4: Browse By Game / Categories */}
            <ServerCategories />

            {/* Section 5: Individual Game Server Lists */}
            <GameServerLists />

            {/* Bottom Spacer/Footer Note */}
            <div className="mt-20 text-center pb-8">
                <p className="text-gray-500 text-sm">
                    Discovering the best communities since 2024.
                </p>
            </div>
        </div>
    );
}
