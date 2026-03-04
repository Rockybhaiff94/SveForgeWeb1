import React from "react";
import { Users, Server, AlertCircle, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-400 mt-1">Manage servers, users, and review reports.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-panel" hoverEffect={false}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">12,482</p>
                        <p className="text-sm font-medium text-gray-400">Total Users</p>
                    </CardContent>
                </Card>

                <Card className="glass-panel" hoverEffect={false}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center">
                                <Server className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">842</p>
                        <p className="text-sm font-medium text-gray-400">Total Servers listed</p>
                    </CardContent>
                </Card>

                <Card className="glass-panel" hoverEffect={false}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-[#F97316]/20 text-[#F97316] flex items-center justify-center">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">14</p>
                        <p className="text-sm font-medium text-[#F97316] animate-pulse">Pending Approvals</p>
                    </CardContent>
                </Card>

                <Card className="glass-panel" hoverEffect={false}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-[#EF4444]/20 text-[#EF4444] flex items-center justify-center">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">5</p>
                        <p className="text-sm font-medium text-[#EF4444] animate-pulse">Active Reports</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Admin Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Pending Approvals List */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="glass-panel h-full" hoverEffect={false}>
                        <CardHeader className="border-b border-white/10 pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-[#F97316]" /> Pending Approvals
                            </CardTitle>
                            <CardDescription>Servers waiting for manual review before being listed.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="divide-y divide-white/5">
                                {[1, 2, 3].map((i) => (
                                    <li key={i} className="p-4 sm:px-6 hover:bg-white/5 transition-colors flex items-center justify-between gap-4">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-semibold text-white">New RPG Realm {i}</p>
                                            <p className="text-xs text-gray-500">Submitted by User{89 + i} • 2 hours ago</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button variant="outline" size="sm" className="text-[#10B981] hover:bg-[#10B981]/20 hover:text-[#34D399] border-[#10B981]/30">
                                                <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-[#EF4444] hover:bg-[#EF4444]/20 hover:text-[#FCA5A5] border-[#EF4444]/30">
                                                <XCircle className="w-4 h-4 mr-1" /> Reject
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                                {/* Empty state when no pending approvals */}
                                {false && (
                                    <div className="p-8 text-center text-gray-500">
                                        No pending server approvals at this time.
                                    </div>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="space-y-4">
                    <Card className="glass-panel" hoverEffect={false}>
                        <CardHeader className="border-b border-white/10 pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-[#EF4444]" /> Recent Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="divide-y divide-white/5">
                                {[1, 2].map((i) => (
                                    <li key={i} className="p-4 hover:bg-white/5 transition-colors flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-semibold text-white">Rule Violation</p>
                                            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">High Priority</span>
                                        </div>
                                        <p className="text-xs text-gray-400">Reported server "Toxic PvP" for fake player counts.</p>
                                        <div className="mt-2 flex justify-end">
                                            <Button variant="outline" size="sm" className="h-7 text-xs">Review Report</Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
