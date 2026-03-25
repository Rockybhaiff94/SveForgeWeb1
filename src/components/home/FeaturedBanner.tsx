"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for weekly trending servers/news
const FEATURED_SERVERS = [
    {
        id: "1",
        name: "Aetherial Network",
        gameType: "Minecraft",
        description: "Premium survival multiplayer with custom enchants, economy, and regular events.",
        bannerImage: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1600&auto=format&fit=crop",
        logoImage: null,
        players: 482,
        slug: "aetherial-network",
    },
    {
        id: "2",
        name: "Rustopia EU Main",
        gameType: "Rust",
        description: "Vanilla Rust experience. Weekly wipes, active admins, no playing admins.",
        bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
        logoImage: null,
        players: 250,
        slug: "rustopia-eu",
    },
    {
        id: "3",
        name: "FiveM Roleplay City",
        gameType: "FiveM",
        description: "Serious RP server. Custom scripts, active police/ems, player-owned businesses.",
        bannerImage: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1600&auto=format&fit=crop",
        logoImage: null,
        players: 128,
        slug: "fivem-rp",
    }
];

export function FeaturedBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-rotate every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === FEATURED_SERVERS.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === FEATURED_SERVERS.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? FEATURED_SERVERS.length - 1 : prev - 1));
    };

    return (
        <div className="w-full">
            <section className="relative w-full overflow-hidden rounded-3xl bg-[#0B0B0F] aspect-[21/9] md:aspect-[24/7] lg:aspect-[32/9] group shadow-2xl shadow-blue-900/10 border border-white/5">
                {/* Slider Container */}
                <div className="relative w-full h-full">
                    {FEATURED_SERVERS.map((server, index) => {
                        const isActive = index === currentSlide;
                        return (
                            <div
                                key={server.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
                            >
                                {/* Background Image */}
                                <Image
                                    src={server.bannerImage || ""}
                                    alt={server.name}
                                    fill
                                    className="object-cover"
                                    priority={isActive}
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/60 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0F]/90 via-[#0B0B0F]/40 to-transparent" />

                                {/* Content Container: Fixed layout and absolutely positioned to prevent shifting */}
                                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center pt-[40px] pb-[40px] px-6 md:px-10 lg:px-14 z-20 transition-transform duration-500 ease">
                                    <div className="max-w-2xl transform transition-transform duration-700 translate-y-0 opacity-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="px-3 py-1 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/50 text-[#3B82F6] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                                                Featured
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-gray-300 text-xs font-semibold backdrop-blur-md">
                                                <Gamepad2 className="w-3.5 h-3.5" />
                                                {server.gameType}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#1A1A22] border-2 border-white/10 shadow-xl overflow-hidden flex items-center justify-center shrink-0">
                                                {server.logoImage ? (
                                                    <Image src={server.logoImage} alt={server.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 text-white font-bold text-2xl">
                                                        {server.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mt-[6px] mb-[10px] drop-shadow-md">
                                                    {server.name}
                                                </h1>
                                                <div className="flex items-center gap-2 text-emerald-400 font-medium bg-emerald-400/10 px-3 py-1 rounded-lg w-fit border border-emerald-400/20">
                                                    <Users className="w-4 h-4" />
                                                    <span className="text-sm">{server.players} Online</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-300 text-sm md:text-base font-medium line-clamp-2 md:line-clamp-3 max-w-xl text-shadow-sm min-h-[48px] md:min-h-[72px] mt-[10px] mb-[18px]">
                                            {server.description}
                                        </p>

                                        <div className="flex items-center gap-4 mt-[12px]">
                                            <Link href={`/server/${server.slug}`}>
                                                <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1 transition-all text-lg border-none">
                                                    Play Now
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Arrows */}
                <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex items-center gap-3 z-30">
                    <button
                        onClick={prevSlide}
                        className="w-12 h-12 rounded-full bg-black/50 border border-white/10 hover:bg-[#3B82F6] hover:border-[#3B82F6] text-white flex items-center justify-center transition-all backdrop-blur-md"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="w-12 h-12 rounded-full bg-black/50 border border-white/10 hover:bg-[#3B82F6] hover:border-[#3B82F6] text-white flex items-center justify-center transition-all backdrop-blur-md"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </section>

            {/* Slider Dots Container Below Banner */}
            <div className="flex justify-center items-center gap-[10px] mt-[14px]">
                {FEATURED_SERVERS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`transition-all duration-300 ${i === currentSlide ? "w-[22px] h-[8px] rounded-[999px] bg-gradient-to-r from-[#3b82f6] to-[#6366f1] shadow-[0_0_10px_rgba(59,130,246,0.6)]" : "w-[8px] h-[8px] rounded-full bg-white/35 hover:bg-white/50"}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
