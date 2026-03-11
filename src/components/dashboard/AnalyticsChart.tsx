"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

export function AnalyticsChart() {
    // Mock data for the smooth line chart
    const data1 = [20, 45, 30, 60, 40, 75, 55, 90, 70, 110]; // Blue line (Votes)
    const data2 = [10, 25, 15, 40, 30, 50, 45, 70, 60, 85];  // Orange line (Visitors)

    const points1 = data1.map((val, i) => `${(i * 100) / (data1.length - 1)},${100 - val}`).join(" ");
    const points2 = data2.map((val, i) => `${(i * 100) / (data2.length - 1)},${100 - val}`).join(" ");

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
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((val) => (
                        <line
                            key={val}
                            x1="0" y1={val} x2="100" y2={val}
                            stroke="white" strokeOpacity="0.03" strokeWidth="0.5"
                        />
                    ))}

                    {/* Blue Line (Votes) */}
                    <polyline
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points1}
                        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] animate-draw"
                        style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'draw 2s ease forwards' }}
                    />

                    {/* Orange Line (Visitors) */}
                    <polyline
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points2}
                        className="drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                        style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: 'draw 2s ease forwards 0.5s' }}
                    />
                </svg>

                {/* Y-axis labels */}
                {/* <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-600 font-bold pr-2 -translate-x-full">
                    <span>1k</span>
                    <span>750</span>
                    <span>500</span>
                    <span>250</span>
                    <span>0</span>
                </div> */}
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
            `}</style>
        </div>
    );
}
