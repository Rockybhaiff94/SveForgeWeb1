"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavBar() {
    const router = useRouter();

    return (
        <header className="absolute top-0 inset-x-0 z-50 flex h-20 w-full items-center justify-between border-b border-white/5 bg-[#0B0B0F]/80 backdrop-blur-xl px-4 lg:px-8">
            <div className="flex items-center gap-4 lg:hidden">
                <Button variant="ghost" size="icon" className="text-gray-400">
                    <Menu className="w-5 h-5" />
                </Button>
                <button onClick={() => router.back()} className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow shadow-blue-500/20">
                        <span className="font-bold text-white text-sm">S</span>
                    </div>
                    <span className="font-bold tracking-tight text-white text-lg">ServerForge</span>
                </button>
            </div>

            <div className="hidden lg:flex items-center gap-3 w-1/4">
                <button onClick={() => router.back()} className="flex items-center gap-3 group cursor-pointer transition-opacity hover:opacity-80">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                        <span className="font-bold text-white text-lg">S</span>
                    </div>
                    <span className="font-extrabold tracking-tight text-white text-xl">ServerForge</span>
                </button>
            </div>

            <nav className="hidden lg:flex items-center justify-center gap-8 flex-1">
                <Link href="/home" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</Link>
                <Link href="/discover" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Discover</Link>
                <Link href="/trending" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Trending</Link>
                <Link href="/top" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Top Rated</Link>
                <Link href="/categories" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Categories</Link>
            </nav>

            <div className="hidden lg:flex items-center justify-end gap-5 w-1/4">
                <Link href="/login">
                    <Button variant="ghost" className="text-gray-300 hover:text-white transition-colors gap-2 font-medium">
                        <LogIn className="w-4 h-4" /> Login
                    </Button>
                </Link>
                <Link href="/login">
                    <Button size="md" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all gap-2 font-semibold">
                        <UserPlus className="w-4 h-4" /> Sign Up
                    </Button>
                </Link>
            </div>
        </header>
    );
}
