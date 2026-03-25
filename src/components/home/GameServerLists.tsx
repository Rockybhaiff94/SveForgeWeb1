import React from "react";
import Link from "next/link";
import { ServerCard } from "@/components/ui/ServerCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Gamepad2 } from "lucide-react";

// Helper generator for mock data to avoid huge arrays
const generateMockServersForGame = (game: string, gameSlug: string, count: number) => {
    return Array(count).fill(0).map((_, i) => ({
        name: `${game} Server #${i + 1}`,
        slug: `${gameSlug}-server-${i + 1}`,
        description: `Join one of the best ${game} communities! Active staff, great economy, and custom features. Experience ${game} like never before.`,
        bannerImage: gameSlug === "minecraft"
            ? "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1000&auto=format&fit=crop"
            : gameSlug === "fivem"
                ? "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1000&auto=format&fit=crop"
                : gameSlug === "rust"
                    ? "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop"
                    : "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: [game, "Community", i % 2 === 0 ? "PvP" : "PvE"],
        votes: Math.floor(Math.random() * 5000) + 100,
        ratingAverage: (Math.random() * 1.5 + 3.5),
        status: "online" as const,
        players: Math.floor(Math.random() * 400) + 10,
        ping: Math.floor(Math.random() * 60) + 15,
    }));
};

const GAMES_TO_DISPLAY = [
    { title: "Minecraft Servers", slug: "minecraft", icon: <Gamepad2 className="w-5 h-5 text-green-500" /> },
    { title: "FiveM Servers", slug: "fivem", icon: <Gamepad2 className="w-5 h-5 text-blue-500" /> },
    { title: "Rust Servers", slug: "rust", icon: <Gamepad2 className="w-5 h-5 text-amber-500" /> },
    { title: "CS2 Servers", slug: "cs2", icon: <Gamepad2 className="w-5 h-5 text-orange-500" /> }
];

export function GameServerLists() {
    return (
        <section className="mt-16 flex flex-col gap-16">
            {GAMES_TO_DISPLAY.map((game, index) => {
                const servers = generateMockServersForGame(game.title.split(' ')[0], game.slug, 4);

                return (
                    <div key={game.slug} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
                        <div className="flex justify-between items-end mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                    {game.icon}
                                </div>
                                <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                                    {game.title}
                                </h2>
                            </div>

                            <Link href={`/category/${game.slug}`}>
                                <Button variant="ghost" className="text-gray-400 hover:text-white group pr-1">
                                    Show More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {servers.map((server) => (
                                <ServerCard key={server.slug} server={server} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
