"use client";

import React, { useState, useEffect } from "react";
import { FilterSidebar } from "@/components/server/FilterSidebar";
import { ServerCard } from "@/components/ui/ServerCard";
import { Button } from "@/components/ui/Button";
import { Loader2, Star } from "lucide-react";

export default function TopClient() {
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Initial filter state defaults to sorting by rating
    const [filters, setFilters] = useState<any>({
        sortBy: "rating",
        gameType: "all",
        region: "all",
        onlineOnly: false,
        minPlayers: "",
        minRating: 0,
        recentlyBumped: false,
        tags: []
    });

    const fetchServers = async (pageNumber: number, currentFilters: any, append = false) => {
        try {
            if (!append) setLoading(true);

            const params = new URLSearchParams();
            params.append("page", pageNumber.toString());
            params.append("limit", "12");

            Object.entries(currentFilters).forEach(([key, value]) => {
                if (value !== "" && value !== "all" && value !== false && (Array.isArray(value) ? value.length > 0 : true)) {
                    params.append(key, Array.isArray(value) ? value.join(",") : String(value));
                }
            });

            const res = await fetch(`/api/servers?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch servers");

            const data = await res.json();

            if (append) {
                setServers(prev => [...prev, ...data.servers]);
            } else {
                setServers(data.servers);
            }

            setHasMore(data.servers.length === 12);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchServers(1, filters, false);
    }, [filters]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchServers(nextPage, filters, true);
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    const topServers = servers.slice(0, 3);
    const restServers = servers.slice(3);

    return (
        <main className="min-h-screen pb-20 relative">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#F97316]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[12000ms]" />
                <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#EA580C]/5 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">

                {/* Hero Section */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                        <Star className="w-8 h-8 text-[#F97316]" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Top Rated <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDBA74] via-[#F97316] to-[#EA580C]">Servers</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                        Highest rated communities by players. Experience the absolute best gameplay evaluated by the community.
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#FDBA74] to-[#EA580C] mx-auto mt-8 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Sidebar */}
                    <div className="w-full lg:w-72 shrink-0 sticky top-24 z-20">
                        <FilterSidebar onFilterChange={handleFilterChange} />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 w-full space-y-12">

                        {loading && page === 1 ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <Loader2 className="w-12 h-12 text-[#F97316] animate-spin" />
                                <p className="text-gray-400 font-medium">Fetching the highest rated servers...</p>
                            </div>
                        ) : servers.length === 0 ? (
                            <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
                                <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No servers found</h3>
                                <p className="text-gray-400">Try adjusting your filters or rating threshold.</p>
                            </div>
                        ) : (
                            <>
                                {/* Top 3 Elite Section */}
                                {page === 1 && topServers.length > 0 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-[#F97316]/20 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                                                <Star className="w-4 h-4 text-[#FDBA74]" />
                                            </span>
                                            Elite Rated
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                                            {topServers.map((server, index) => (
                                                <div key={server._id || index} className={`animate-in fade-in zoom-in-95 duration-500 delay-${index * 100} ${index === 0 ? 'md:col-span-2 lg:col-span-1 lg:-translate-y-4' : ''}`}>
                                                    <ServerCard
                                                        server={server}
                                                        rank={index + 1}
                                                        isTopRated={true}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Main Grid */}
                                {restServers.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                                        {restServers.map((server, index) => (
                                            <div key={server._id || index} className={`animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                                                <ServerCard
                                                    server={server}
                                                    rank={topServers.length + index + 1}
                                                    isTopRated={true}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Pagination / Load More */}
                                {hasMore && (
                                    <div className="pt-8 flex justify-center">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={loadMore}
                                            disabled={loading}
                                            className="min-w-[200px] border-white/10 hover:bg-white/5 hover:border-[#F97316]/50 hover:text-[#FDBA74] group"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            ) : (
                                                <Star className="w-5 h-5 mr-2 group-hover:fill-[#FDBA74] transition-colors" />
                                            )}
                                            Load More Servers
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
