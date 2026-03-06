"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu, User, Settings as SettingsIcon, LogOut, Disc } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function TopBar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Create a safe callback URL that avoids redirect loops
    const callbackUrl = encodeURIComponent(pathname === "/login" || pathname === "/signup" ? "/profile" : pathname);

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#050505]/90 backdrop-blur-md px-4 lg:px-8">
            <div className="flex items-center gap-4 lg:hidden">
                <Button variant="ghost" size="icon" className="text-gray-400">
                    <Menu className="w-5 h-5" />
                </Button>
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#3B82F6] flex items-center justify-center">
                        <span className="font-bold text-white text-xs">S</span>
                    </div>
                    <span className="font-bold tracking-tight text-white">ServerForge</span>
                </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-6 ml-6 mr-6 flex-1">
                <Link href="/home" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</Link>
                <Link href="/discover" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Discover</Link>
                <Link href="/trending" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Trending</Link>
                <Link href="/top" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Top Rated</Link>
                <Link href="/categories" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Categories</Link>
            </nav>

            <div className="hidden lg:flex items-center w-64 relative mr-4">
                <Search className="absolute left-3 w-4 h-4 text-[#9CA3AF]" />
                <input
                    type="text"
                    placeholder="Search servers..."
                    className="w-full bg-[#121212] border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-sm text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all shadow-inner"
                />
            </div>

            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative group">
                    <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-gray-900 border-none shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </Button>

                <div className="h-8 w-px bg-white/10 hidden sm:block mx-1" />

                <div className="hidden sm:flex items-center gap-2">
                    {status === "loading" ? (
                        <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                    ) : session?.user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                                className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all"
                            >
                                {session.user.avatarUrl ? (
                                    <img src={session.user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-white font-medium text-sm">
                                        {session.user.username?.charAt(0).toUpperCase() || "U"}
                                    </span>
                                )}
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></span>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#121212] border border-white/10 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                    <div className="px-4 py-3 border-b border-white/5">
                                        <p className="text-sm font-medium text-white truncate">{session.user.username}</p>
                                        <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                            <User className="w-4 h-4" /> View Profile
                                        </Link>
                                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                            <Disc className="w-4 h-4" /> Dashboard
                                        </Link>
                                        <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                            <SettingsIcon className="w-4 h-4" /> Settings
                                        </Link>
                                    </div>
                                    <div className="border-t border-white/5 py-1">
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href={`/login?callbackUrl=${callbackUrl}`}>
                                <Button variant="ghost" className="text-gray-300">
                                    Login
                                </Button>
                            </Link>
                            <Link href={`/login?callbackUrl=${callbackUrl}`}>
                                <Button variant="glow" className="shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
