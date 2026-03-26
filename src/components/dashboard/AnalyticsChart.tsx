"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

export function AnalyticsChart() {
    // Premium mock data for smooth waves
    const visitorsData = [35, 65, 45, 85, 60, 95, 75, 120, 90, 115, 105, 130]; 
    const joinsData = [20, 40, 30, 55, 40, 65, 50, 80, 65, 85, 80, 95];

    // SVG helper to generate smooth cubic bezier curves
    const getCurvedPath = (data: number[]) => {
        if (data.length < 2) return "";
        const width = 1000;
        const height = 300;
        const dx = width / (data.length - 1);
        const maxVal = 140; // Normalize against a max value
        
        let d = `M 0,${height - (data[0] / maxVal) * height} `;
        
        for (let i = 0; i < data.length - 1; i++) {
            const x1 = i * dx;
            const y1 = height - (data[i] / maxVal) * height;
            const x2 = (i + 1) * dx;
            const y2 = height - (data[i + 1] / maxVal) * height;
            
            // Smooth control points
            const cp1x = x1 + dx / 2;
            const cp1y = y1;
            const cp2x = x1 + dx / 2;
            const cp2y = y2;
            
            d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2} `;
        }
        return d;
    };

    const vPath = getCurvedPath(visitorsData);
    const jPath = getCurvedPath(joinsData);
    
    const vArea = `${vPath} L 1000,300 L 0,300 Z`;
    const jArea = `${jPath} L 1000,300 L 0,300 Z`;

    return (
        <div className="glass-panel p-8 rounded-[32px] border border-white/5 relative overflow-hidden h-[450px] flex flex-col bg-white/[0.01]">
            {/* BACKGROUND GLOW */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
            
            <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                        Real-time Stats
                    </h3>
                    <h2 className="text-2xl font-black text-white tracking-tight">GROWTH ANALYTICS</h2>
                    <p className="text-xs text-gray-500 font-bold mt-1">Daily server interactions and visitor conversion</p>
                </div>
                
                <div className="flex items-center gap-8 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visitors</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joins</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative mx-[-2rem]">
                <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="g-blue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="g-orange" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* HORIZONTAL GRID */}
                    {[0, 75, 150, 225, 300].map((y) => (
                        <line 
                            key={y} x1="0" y1={y} x2="1000" y2={y} 
                            stroke="white" strokeOpacity="0.03" strokeWidth="1" 
                        />
                    ))}

                    {/* AREAS */}
                    <path d={vArea} fill="url(#g-blue)" className="animate-fade-in opacity-0" style={{ animation: 'fade-in 2s ease forwards' }} />
                    <path d={jArea} fill="url(#g-orange)" className="animate-fade-in opacity-0" style={{ animation: 'fade-in 2s ease forwards 0.5s' }} />

                    {/* LINES */}
                    <path 
                        d={vPath} fill="none" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" 
                        className="drop-shadow-[0_0_15px_rgba(59,130,246,0.4)] animate-draw"
                        style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animation: 'draw 3s ease-out forwards' }}
                    />
                    <path 
                        d={jPath} fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" 
                        className="drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-draw"
                        style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animation: 'draw 3s ease-out forwards 0.5s' }}
                    />
                </svg>
            </div>

            <div className="flex justify-between mt-8 relative z-10 px-4">
                {['MAR 20', 'MAR 21', 'MAR 22', 'MAR 23', 'MAR 24', 'MAR 25', 'MAR 26'].map((day) => (
                    <span key={day} className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{day}</span>
                ))}
            </div>

            <style jsx>{`
                @keyframes draw { to { stroke-dashoffset: 0; } }
                @keyframes fade-in { to { opacity: 1; } }
            `}</style>
        </div>
    );
}
