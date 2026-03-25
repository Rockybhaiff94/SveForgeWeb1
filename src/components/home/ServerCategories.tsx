import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FolderGit2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const CATEGORIES = [
    {
        name: "Minecraft",
        slug: "minecraft",
        serversCount: 8452,
        backgroundImage: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=800&auto=format&fit=crop",
        logo: "MC"
    },
    {
        name: "FiveM",
        slug: "fivem",
        serversCount: 3120,
        backgroundImage: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop",
        logo: "5M"
    },
    {
        name: "Rust",
        slug: "rust",
        serversCount: 1890,
        backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
        logo: "RU"
    },
    {
        name: "CS2",
        slug: "cs2",
        serversCount: 2405,
        backgroundImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
        logo: "CS"
    },
    {
        name: "ARK",
        slug: "ark",
        serversCount: 950,
        backgroundImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop",
        logo: "AK"
    },
    {
        name: "GTA RP",
        slug: "gta-rp",
        serversCount: 1240,
        backgroundImage: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=800&auto=format&fit=crop",
        logo: "RP"
    }
];

export function ServerCategories() {
    return (
        <section className="mt-16">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <FolderGit2 className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Browse by Game</h2>
                    <p className="text-gray-400 text-sm mt-1">Find the perfect server for your favorite games.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                {CATEGORIES.map((category) => (
                    <Link key={category.slug} href={`/category/${category.slug}`} className="block group">
                        <Card className="relative overflow-hidden aspect-[4/5] rounded-2xl border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)] bg-[#121212]">
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={category.backgroundImage}
                                    alt={`${category.name} servers`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/60 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/30 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 z-10 flex flex-col p-4 sm:p-5">
                                <div className="w-12 h-12 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white font-black text-xl mb-auto group-hover:scale-110 transition-transform shadow-lg">
                                    {category.logo}
                                </div>

                                <div className="mt-auto transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <h3 className="font-bold text-xl text-white mb-1 drop-shadow-md">{category.name}</h3>
                                    <div className="text-purple-400 text-xs sm:text-sm font-semibold tracking-wide bg-black/40 w-fit px-2 py-1 rounded backdrop-blur-sm border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        {category.serversCount.toLocaleString("en-US")} Servers
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
