"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LandingNavBar } from "@/components/home/LandingNavBar";
import { ServerCard } from "@/components/ui/ServerCard";
import { Button } from "@/components/ui/Button";
import { Search, TrendingUp, BarChart, Shield, UserPlus, Gamepad2, Users, ArrowRight, Activity, Globe, ChevronRight, Server } from "lucide-react";

// Minimal mock exactly recreating the "ServerCard" acceptable prop structure for preview 
const FEATURED_SERVERS = [
    {
        name: "Hypixel Network",
        slug: "hypixel-network",
        description: "The largest Minecraft server in the world. Enjoy minigames, skyblock, and more!",
        bannerImage: "https://images.unsplash.com/photo-1623947413645-0cd61e3d641d?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Minigames", "Skyblock", "PvP"],
        votes: 145920,
        ratingAverage: 4.9,
        status: "online" as const,
        players: 48210,
    },
    {
        name: "Rustafied EU Main",
        slug: "rustafied-eu",
        description: "Official Rust server. Weekly wipes, premium performance, survive and conquer.",
        bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Vanilla", "PvP", "Weekly"],
        votes: 8934,
        ratingAverage: 4.8,
        status: "online" as const,
        players: 320,
    },
    {
        name: "Eclipse RP (FiveM)",
        slug: "eclipse-rp",
        description: "Premier GTA V Roleplay experience. Custom economy, jobs, police, and gangs.",
        bannerImage: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Roleplay", "Economy", "Whitelist"],
        votes: 12053,
        ratingAverage: 4.7,
        status: "online" as const,
        players: 1024,
    },
    {
        name: "ARK: Survival Ascended - Official PvE",
        slug: "ark-ascended",
        description: "Official PvE cluster serving multiple maps with cross-play enabled.",
        bannerImage: null,
        logoImage: null,
        tags: ["PvE", "Crossplay", "Official"],
        votes: 5621,
        ratingAverage: 4.5,
        status: "online" as const,
        players: 250,
    },
    {
        name: "CS2 Retakes & Scrims",
        slug: "cs2-retakes",
        description: "128-tick perfect CS2 retake servers with advanced stats and rank progression.",
        bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Retakes", "Competitive", "128-tick"],
        votes: 4322,
        ratingAverage: 4.8,
        status: "online" as const,
        players: 45,
    },
    {
        name: "PixelMon Reforged",
        slug: "pixelmon-reforged",
        description: "Catch 'em all in Minecraft! Tournaments, gyms, and an active community.",
        bannerImage: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1000&auto=format&fit=crop",
        logoImage: null,
        tags: ["Pixelmon", "Gyms", "Economy"],
        votes: 890,
        ratingAverage: 4.6,
        status: "online" as const,
        players: 450,
    }
];

const GAME_CATEGORIES = [
    { name: "Minecraft", count: 8432, icon: <Globe className="w-8 h-8 text-[#3B82F6]" /> },
    { name: "FiveM", count: 3201, icon: <Gamepad2 className="w-8 h-8 text-[#FF7A1A]" /> },
    { name: "Rust", count: 1843, icon: <Shield className="w-8 h-8 text-red-500" /> },
    { name: "CS2", count: 942, icon: <Activity className="w-8 h-8 text-yellow-500" /> },
    { name: "ARK", count: 753, icon: <Globe className="w-8 h-8 text-green-500" /> },
    { name: "GTA RP", count: 2108, icon: <Users className="w-8 h-8 text-purple-500" /> },
];

export default function LandingPageContent() {
    return (
        <div className="w-full relative pb-20">
            {/* Background Globals */}
            <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#3B82F6] opacity-[0.06] blur-[150px] rounded-full"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#FF7A1A] opacity-[0.05] blur-[150px] rounded-full"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <LandingNavBar />

            {/* 1. HERO SECTION */}
            <section className="relative pt-32 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-16">
                <motion.div
                    className="flex-1 text-center lg:text-left z-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A22] border border-white/5 mb-6 text-sm font-medium text-[#9CA3AF]">
                        <span className="flex h-2 w-2 rounded-full bg-[#10B981]"></span>
                        Over 25,000 servers listed
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-[#FFFFFF] tracking-tight leading-[1.1] mb-6">
                        Discover the Best <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Gaming Servers</span>
                    </h1>
                    <p className="text-xl text-[#9CA3AF] mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Find and join Minecraft, FiveM, Rust, and CS2 servers in seconds. Join massive communities or create your own legacy.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Link href="/home" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all h-14 px-8 text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                                Explore Servers <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white bg-[#121218] transition-all h-14 px-8 text-lg font-medium">
                                Add Your Server
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    className="flex-1 relative hidden lg:block h-[500px]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {/* Floating Cards Illusion */}
                    <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="absolute right-0 top-10 w-80 bg-[#1A1A22] rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur-sm z-20"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                                <Globe className="w-6 h-6 text-[#3B82F6]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Hypixel Network</h3>
                                <p className="text-xs text-[#9CA3AF]">Minecraft • Minigames</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-white/5 pt-4">
                            <span className="flex items-center text-[#10B981]"><span className="w-2 h-2 rounded-full bg-[#10B981] mr-2"></span>48,210 Online</span>
                            <span className="text-[#3B82F6] font-semibold">Join Now</span>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [10, -10, 10] }}
                        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
                        className="absolute left-0 bottom-20 w-80 bg-[#1A1A22] rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur-sm z-10"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-[#FF7A1A]/20 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-[#FF7A1A]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Rustafied EU Main</h3>
                                <p className="text-xs text-[#9CA3AF]">Rust • Vanilla PvP</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-white/5 pt-4">
                            <span className="flex items-center text-[#10B981]"><span className="w-2 h-2 rounded-full bg-[#10B981] mr-2"></span>320 Online</span>
                            <span className="text-[#3B82F6] font-semibold">Join Now</span>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* TRUSTED BY BANNER */}
            <section className="py-10 border-y border-white/5 bg-[#121218]/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-widest mb-6">Trusted by top server networks</p>
                    <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-bold text-xl text-white"><Shield className="w-6 h-6" /> Rustafied</div>
                        <div className="flex items-center gap-2 font-bold text-xl text-white"><Globe className="w-6 h-6" /> Hypixel</div>
                        <div className="flex items-center gap-2 font-bold text-xl text-white"><Gamepad2 className="w-6 h-6" /> Eclipse RP</div>
                        <div className="flex items-center gap-2 font-bold text-xl text-white"><Activity className="w-6 h-6" /> Facepunch</div>
                    </div>
                </div>
            </section>

            {/* 2. FEATURED SERVERS PREVIEW */}
            <section className="py-24 bg-[#121218]/50 border-b border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Featured Servers</h2>
                            <p className="text-[#9CA3AF]">Discover the most popular rising communities across all games.</p>
                        </div>
                        <Link href="/discover" className="hidden sm:flex items-center text-[#3B82F6] hover:text-[#FFFFFF] transition-colors font-medium">
                            View All Servers <ChevronRight className="ml-1 w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURED_SERVERS.map((server, idx) => (
                            <motion.div
                                key={server.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <ServerCard server={server} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-10 sm:hidden flex justify-center">
                        <Link href="/discover" className="w-full">
                            <Button variant="outline" className="w-full bg-[#1A1A22] border-white/5 text-white">
                                View All Servers
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. WHY SERVERFORGE SECTION */}
            <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Why Choose ServerForge</h2>
                    <p className="text-[#9CA3AF] max-w-2xl mx-auto">Build, grow, and manage your gaming community using our modern SaaS platform designed purely for performance and discoverability.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Search className="w-6 h-6 text-[#3B82F6]" />, title: "Advanced Discovery", desc: "Our complex tagging and filtering system makes sure players find exactly what they want." },
                        { icon: <TrendingUp className="w-6 h-6 text-[#10B981]" />, title: "Daily Voting System", desc: "Top servers rise to the top naturally with our integrated, fraud-protected voting mechanics." },
                        { icon: <BarChart className="w-6 h-6 text-[#FF7A1A]" />, title: "Server Analytics", desc: "Track your clicks, joins, and player retention with beautiful real-time dashboard analytics." },
                        { icon: <Users className="w-6 h-6 text-[#8B5CF6]" />, title: "Grow Your Community", desc: "Hook up your Discord, link rewards, and watch your playerbase grow passively every day." }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(59,130,246,0.15)" }}
                            className="bg-[#1A1A22] border border-white/5 p-8 rounded-2xl group transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-[#121218] rounded-xl flex items-center justify-center border border-white/5 mb-6 group-hover:border-[#3B82F6]/30 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-sm text-[#9CA3AF] leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="py-24 bg-[#121218]/50 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
                        <p className="text-[#9CA3AF]">Three simple steps to launch your community.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0"></div>

                        {[
                            { step: "01", icon: <UserPlus className="w-8 h-8 text-[#3B82F6]" />, title: "Create an Account", desc: "Sign in with Discord or email instantly." },
                            { step: "02", icon: <Shield className="w-8 h-8 text-[#FF7A1A]" />, title: "Add Your Server", desc: "Fill in your server details, banners, and IPs." },
                            { step: "03", icon: <TrendingUp className="w-8 h-8 text-[#10B981]" />, title: "Grow Your Community", desc: "Receive organic traffic and climb the ranks." }
                        ].map((item, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center text-center max-w-[250px]">
                                <div className="w-20 h-20 bg-[#1A1A22] border border-white/10 rounded-2xl flex items-center justify-center shadow-lg mb-6 relative">
                                    <span className="absolute -top-3 -left-3 w-8 h-8 bg-[#0B0B0F] border border-white/10 rounded-full flex items-center justify-center text-xs font-bold text-[#9CA3AF]">{item.step}</span>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-[#9CA3AF]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. POPULAR GAME CATEGORIES */}
            <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Explore by Game</h2>
                        <p className="text-[#9CA3AF]">Find specialized servers for your favorite titles.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {GAME_CATEGORIES.map((cat, idx) => (
                        <Link href="/discover" key={idx}>
                            <motion.div
                                whileHover={{ scale: 1.05, borderColor: "rgba(59,130,246,0.5)" }}
                                className="bg-[#1A1A22] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center justify-center gap-4 transition-colors hover:bg-white/5 cursor-pointer h-full"
                            >
                                <div className="p-3 bg-white/5 rounded-xl">
                                    {cat.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                                    <p className="text-xs text-[#9CA3AF] mt-1">{cat.count.toLocaleString("en-US")} Servers</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 6. SERVER OWNER CTA */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121218] p-10 md:p-16 text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 to-[#FF7A1A]/10 opacity-50 blur-xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Grow Your Gaming Community</h2>
                        <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto mb-10">
                            Join thousands of server owners who use ServerForge to reach new players, manage analytics, and build thriving communities. List your server for free today.
                        </p>
                        <Link href="/login">
                            <Button size="lg" className="bg-[#FF7A1A] hover:bg-[#EA580C] text-white font-bold h-14 px-10 text-lg shadow-[0_0_20px_rgba(255,122,26,0.3)] hover:shadow-[0_0_30px_rgba(255,122,26,0.5)] transition-all">
                                Add Your Server <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. DISCORD CTA */}
            <section className="py-12 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex w-20 h-20 bg-[#5865F2] rounded-2xl items-center justify-center shadow-lg">
                            <img src="/window.svg" alt="Discord" className="w-10 h-10 filter invert brightness-0" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Join Our Discord Community</h2>
                            <p className="text-[#9CA3AF]">Connect with other owners, get support, and share tips. 5,430+ members online.</p>
                        </div>
                    </div>
                    <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white whitespace-nowrap px-8 h-12 w-full md:w-auto">
                        Join Discord Server
                    </Button>
                </div>
            </section>

            {/* 8. FOOTER */}
            <footer className="border-t border-white/5 bg-[#0B0B0F] pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow shadow-blue-500/20">
                                    <Server className="w-5 h-5 text-white" />
                                </div>
                                ServerForge
                            </h2>
                            <p className="text-[#9CA3AF] max-w-xs leading-relaxed">
                                The premium discovery platform for finding and growing the best multiplayer gaming communities worldwide.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-4">Platform</h3>
                            <ul className="space-y-3">
                                <li><Link href="/discover" className="text-[#9CA3AF] hover:text-white transition-colors">Discover Servers</Link></li>
                                <li><Link href="/trending" className="text-[#9CA3AF] hover:text-[#FF7A1A] transition-colors">Trending Servers</Link></li>
                                <li><Link href="/top" className="text-[#9CA3AF] hover:text-white transition-colors">Top Rated</Link></li>
                                <li><Link href="/login" className="text-[#9CA3AF] hover:text-[#3B82F6] transition-colors">Add Server</Link></li>
                                <li><Link href="/dashboard" className="text-[#9CA3AF] hover:text-white transition-colors">Owner Dashboard</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-4">Community</h3>
                            <ul className="space-y-3">
                                <li><Link href="#" className="text-[#9CA3AF] hover:text-[#5865F2] transition-colors flex items-center gap-2"><Globe className="w-4 h-4" /> Discord</Link></li>
                                <li><Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-2"><Globe className="w-4 h-4" /> GitHub</Link></li>
                                <li><Link href="#" className="text-[#9CA3AF] hover:text-[#1DA1F2] transition-colors flex items-center gap-2"><Globe className="w-4 h-4" /> Twitter</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-[#9CA3AF]">
                        <p>© 2026 ServerForge. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
