"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

export function AnalyticsChart() {
    // Mock data for the smooth line chart
    const data1 = [20, 45, 30, 60, 40, 75, 55, 90, 70, 110]; // Blue line (Votes)
    const data2 = [10, 25, 15, 40, 30, 50, 45, 70, 60, 85];  // Orange line (Visitors)

    const generateSmoothPath = (data: number[]) => {
        if (data.length === 0) return "";
        const dx = 100 / (data.length - 1);
        let path = `M 0,${100 - data[0]} `;
        for (let i = 0; i < data.length - 1; i++) {
            const x1 = i * dx;
            const y1 = 100 - data[i];
            const x2 = (i + 1) * dx;
            const y2 = 100 - data[i + 1];
            // Simple cubic bezier control points for a smooth curve
            const cx1 = x1 + dx / 2;
            const cy1 = y1;
            const cx2 = x1 + dx / 2;
            const cy2 = y2;
            path += `C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2} `;
        }
        return path;
    };

    const path1 = generateSmoothPath(data1);
    const path2 = generateSmoothPath(data2);
    
    // Area paths (close the curve to the bottom)
    const areaPath1 = `${path1} L 100,100 L 0,100 Z`;
    const areaPath2 = `${path2} L 100,100 L 0,100 Z`;

    return (
        <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" /> Server Analytics
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Real-time performance metrics</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Votes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Visitors</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative mt-4">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="gradient-orange" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                        </linearGradient>
                        <clipPath id="chart-clip">
                            <rect x="0" y="0" width="100" height="100" />
                        </clipPath>
                    </defs>

                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((val) => (
                        <line
                            key={val}
                            x1="0" y1={val} x2="100" y2={val}
                            stroke="white" strokeOpacity="0.03" strokeWidth="0.5"
                            strokeDasharray="2 2"
                        />
                    ))}

                    <g clipPath="url(#chart-clip)">
                        {/* Orange Area (Visitors) - Draw First to be in background */}
                        <path
                            d={areaPath2}
                            fill="url(#gradient-orange)"
                            className="opacity-0 animate-fade-in"
                            style={{ animation: 'fade-in 1s ease forwards 0.5s' }}
                        />
                        {/* Orange Line */}
                        <path
                            d={path2}
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-draw"
                            style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'draw 2s ease forwards 0.5s' }}
                        />

                        {/* Blue Area (Votes) */}
                        <path
                            d={areaPath1}
                            fill="url(#gradient-blue)"
                            className="opacity-0 animate-fade-in"
                            style={{ animation: 'fade-in 1s ease forwards' }}
                        />
                        {/* Blue Line */}
                        <path
                            d={path1}
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-draw"
                            style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'draw 2s ease forwards' }}
                        />
                    </g>
                </svg>
            </div>

            <div className="flex justify-between mt-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
            </div>

            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 opacity-5 blur-[100px] -mr-32 -mb-32"></div>

            <style jsx>{`
                @keyframes draw {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes fade-in {
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
