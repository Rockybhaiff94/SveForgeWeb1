"use client";

import React, { useState } from "react";
import { Filter, ChevronDown, Check, SlidersHorizontal, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
    onFilterChange: (filters: any) => void;
    className?: string;
}

export function FilterSidebar({ onFilterChange, className = "" }: FilterSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // State for various filters
    const [filters, setFilters] = useState({
        sortBy: "trending",
        gameType: "all",
        region: "all",
        onlineOnly: false,
        minPlayers: "",
        minRating: 0,
        recentlyBumped: false,
        tags: [] as string[]
    });

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleTag = (tag: string) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag];
        handleFilterChange("tags", newTags);
    };

    // Predefined options
    const gameTypes = ["Minecraft", "Rust", "Ark", "FiveM", "Terraria"];
    const regions = ["North America", "Europe", "Asia", "Oceania", "South America"];
    const popularTags = ["PvP", "PvE", "Roleplay", "Survival", "Vanilla", "Modded", "Economy"];

    return (
        <div className={`glass-panel border border-white/5 rounded-2xl overflow-hidden flex flex-col ${className}`}>

            {/* Mobile Toggle Button */}
            <div className="lg:hidden p-4 border-b border-white/5">
                <Button
                    variant="ghost"
                    className="w-full flex justify-between items-center text-gray-300 bg-white/5"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="flex items-center gap-2"><Filter className="w-4 h-4" /> Filters & Sort</span>
                    {isOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
            </div>

            <div className={`flex-col ${isOpen ? 'flex' : 'hidden lg:flex'} transition-all duration-300 ease-in-out`}>

                {/* Header */}
                <div className="p-5 border-b border-white/5 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[#3B82F6]" />
                    <h3 className="font-semibold text-white">Search Filters</h3>
                </div>

                <div className="p-5 space-y-8 overflow-y-auto max-h-[calc(100vh-12rem)] scrollbar-hide">

                    {/* Sort By */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sort By</label>
                        <select
                            value={filters.sortBy}
                            title="Sort by"
                            aria-label="Sort by"
                            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 appearance-none"
                        >
                            <option value="trending">Highest Trending (Hot)</option>
                            <option value="rating">Highest Rated</option>
                            <option value="votes">Most Voted</option>
                            <option value="players">Most Players Online</option>
                            <option value="newest">Recently Added</option>
                            <option value="bumped">Recently Bumped</option>
                        </select>
                    </div>

                    {/* Game Type */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Game Type</label>
                        <select
                            value={filters.gameType}
                            title="Game Type"
                            aria-label="Game Type"
                            onChange={(e) => handleFilterChange("gameType", e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 appearance-none"
                        >
                            <option value="all">All Games</option>
                            {gameTypes.map(game => (
                                <option key={game} value={game.toLowerCase()}>{game}</option>
                            ))}
                        </select>
                    </div>

                    {/* Region */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Server Region</label>
                        <select
                            value={filters.region}
                            title="Server Region"
                            aria-label="Server Region"
                            onChange={(e) => handleFilterChange("region", e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 appearance-none"
                        >
                            <option value="all">Any Region</option>
                            {regions.map(region => (
                                <option key={region} value={region.toLowerCase()}>{region}</option>
                            ))}
                        </select>
                    </div>

                    {/* Toggles & Numerical Inputs */}
                    <div className="space-y-4">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                            Requirements
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={filters.onlineOnly}
                                    onChange={(e) => handleFilterChange("onlineOnly", e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${filters.onlineOnly ? 'bg-[#2563EB]' : 'bg-gray-700'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.onlineOnly ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Must Be Online</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={filters.recentlyBumped}
                                    onChange={(e) => handleFilterChange("recentlyBumped", e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${filters.recentlyBumped ? 'bg-[#2563EB]' : 'bg-gray-700'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.recentlyBumped ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Recently Bumped (48h)</span>
                        </label>

                        <div className="pt-2">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-300 whitespace-nowrap">Min Players:</span>
                                <input
                                    type="number"
                                    placeholder="e.g. 50"
                                    value={filters.minPlayers}
                                    onChange={(e) => handleFilterChange("minPlayers", e.target.value)}
                                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#3B82F6]/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rating Threshold */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Min Rating</label>
                            <span className="text-xs text-yellow-400 font-semibold">{filters.minRating > 0 ? `${filters.minRating}+ Stars` : 'Any'}</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="5" step="0.5"
                            title="Minimum Rating"
                            aria-label="Minimum Rating"
                            value={filters.minRating}
                            onChange={(e) => handleFilterChange("minRating", parseFloat(e.target.value))}
                            className="w-full accent-yellow-400 bg-gray-800 rounded-full appearance-none h-1.5 cursor-pointer"
                        />
                    </div>

                    {/* Popular Tags */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filter by Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {popularTags.map((tag) => {
                                const isSelected = filters.tags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${isSelected
                                            ? 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Footer sticky area */}
                <div className="p-5 border-t border-white/5 bg-black/20 backdrop-blur-md">
                    <Button
                        variant="glow"
                        className="w-full gap-2 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                        onClick={() => setIsOpen(false)}
                    >
                        <Search className="w-4 h-4" /> Apply Filters
                    </Button>
                </div>
            </div>
        </div>
    );
}
