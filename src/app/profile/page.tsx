"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { User, Server, Activity, Shield, Edit3, Settings, Trash2, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<"account" | "servers" | "activity" | "security">("account");
    const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
    const [hasPassword, setHasPassword] = useState(false);

    useEffect(() => {
        if (activeTab === "security") {
            fetch("/api/auth/accounts")
                .then(res => res.json())
                .then(data => {
                    if (data.accounts) setLinkedAccounts(data.accounts);
                    if (data.hasPassword !== undefined) setHasPassword(data.hasPassword);
                })
                .catch(err => console.error("Failed to fetch accounts", err));
        }
    }, [activeTab]);

    const handleUnlink = async (provider: string) => {
        const res = await fetch("/api/auth/accounts", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ provider })
        });
        const data = await res.json();
        if (data.success) {
            setLinkedAccounts(prev => prev.filter(acc => acc.provider !== provider));
        } else {
            alert(data.error || "Failed to unlink account");
        }
    };

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-[60vh] space-y-4 flex-col">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                <p className="text-gray-400 animate-pulse">Loading profile...</p>
            </div>
        );
    }

    if (!session?.user) {
        return null; // covered by middleware
    }

    const { user } = session;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="relative glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="h-48 bg-[#121212] relative">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                </div>

                <div className="px-8 pb-8 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end sm:justify-between gap-6 -mt-16">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-[#050505] bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-bold text-white">{user.username?.charAt(0).toUpperCase() || "U"}</span>
                                )}
                            </div>
                            <button className="absolute bottom-2 right-2 w-8 h-8 bg-[#3B82F6] hover:bg-[#60A5FA] rounded-full flex items-center justify-center text-white border-2 border-[#050505] shadow-lg transition-colors group-hover:scale-110">
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="text-center sm:text-left mt-4 sm:mt-16">
                            <h1 className="text-3xl font-bold pl-2 text-white flex items-center gap-3 justify-center sm:justify-start">
                                {user.username}
                                {user.role === "admin" && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30 uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.3)]">Admin</span>
                                )}
                                {user.provider === "google" && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-xs font-semibold border border-[#3B82F6]/30 shadow-[0_0_10px_rgba(59,130,246,0.3)] flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-[#3B82F6]/50 flex items-center justify-center font-bold text-[8px] text-white">G</div> Google User
                                    </span>
                                )}
                                {user.provider === "discord" && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#5865F2]/20 text-[#5865F2] text-xs font-semibold border border-[#5865F2]/30 shadow-[0_0_10px_rgba(88,101,242,0.3)] flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-[#5865F2]/50 flex items-center justify-center font-bold text-[8px] text-white">D</div> Discord User
                                    </span>
                                )}
                            </h1>
                            <p className="text-gray-400 pl-2 mt-1">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="ghost" className="border border-white/10 hover:bg-white/5">
                            <Settings className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { id: "account", label: "Account Info", icon: User },
                        { id: "servers", label: "My Servers", icon: Server },
                        { id: "activity", label: "Activity Log", icon: Activity },
                        { id: "security", label: "Security", icon: Shield },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-medium transition-all ${activeTab === tab.id
                                ? "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]"
                                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-[#3B82F6]" : "text-gray-500"}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <div className="glass-panel p-8 rounded-2xl border border-white/10 min-h-[500px]">

                        {/* TAB: Account Info */}
                        {activeTab === "account" && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>
                                    <div className="grid gap-6 max-w-xl">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Username</label>
                                            <input type="text" defaultValue={user.username} className="w-full bg-[#121212] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Email Address</label>
                                            <input type="email" defaultValue={user.email || undefined} disabled className="w-full bg-[#121212] border border-white/5 rounded-lg py-2.5 px-4 text-gray-500 cursor-not-allowed" />
                                            <p className="text-xs text-gray-500">Email cannot be changed directly. Contact support if needed.</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400">Account Created</label>
                                                <div className="w-full bg-[#121212] border border-white/5 rounded-lg py-2.5 px-4 text-gray-300">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400">Last Login</label>
                                                <div className="w-full bg-[#121212] border border-white/5 rounded-lg py-2.5 px-4 text-gray-300">
                                                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Unknown"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Bio</label>
                                            <textarea rows={4} placeholder="Tell us about your gaming setup..." className="w-full bg-[#121212] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 resize-none"></textarea>
                                        </div>
                                        <div>
                                            <Button variant="glow" className="shadow-[0_0_15px_rgba(59,130,246,0.4)]">Save Changes</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: My Servers */}
                        {activeTab === "servers" && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-white">My Submitted Servers</h2>
                                    <Button variant="ghost" className="text-[#3B82F6] hover:text-[#60A5FA] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20">Add New Server</Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Placeholder Server Card */}
                                    <div className="bg-[#121212] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20">
                                                    <Server className="w-6 h-6 text-[#3B82F6]" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-white group-hover:text-[#3B82F6] transition-colors">Hypixel Network</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                                                        <span className="text-xs text-gray-400">Approved</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-lg font-bold text-gray-300 bg-white/5 px-2 py-1 rounded">2.4k ▲</span>
                                        </div>

                                        <div className="flex gap-2 mt-6 pt-4 border-t border-white/5">
                                            <Button variant="ghost" size="sm" className="flex-1 text-xs text-gray-400 hover:text-white hover:bg-white/5">
                                                <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit
                                            </Button>
                                            <Button variant="ghost" size="sm" className="flex-1 text-xs text-[#3B82F6] hover:text-[#60A5FA] hover:bg-[#3B82F6]/10">
                                                <ArrowUpCircle className="w-3.5 h-3.5 mr-1.5" /> Bump
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Placeholder Add New */}
                                    <div className="border border-dashed border-white/10 rounded-xl p-5 flex flex-col items-center justify-center text-gray-500 hover:text-gray-300 hover:border-white/30 transition-all cursor-pointer min-h-[140px] bg-white/[0.02] hover:bg-white/5">
                                        <Server className="w-8 h-8 mb-2 opacity-50" />
                                        <span className="text-sm font-medium">Submit another server</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: Activity */}
                        {activeTab === "activity" && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5">
                                            <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                                                <ArrowUpCircle className="w-5 h-5 text-[#3B82F6]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-300">You voted for <span className="text-white font-medium">Mineplex</span></p>
                                                <p className="text-xs text-gray-500">{i * 2} days ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB: Security */}
                        {activeTab === "security" && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-2">Security Settings</h2>
                                    <p className="text-sm text-gray-400 mb-6">Manage your password and active sessions.</p>

                                    <div className="max-w-xl space-y-6">
                                        <div className="p-5 border border-white/10 rounded-xl bg-black/20">
                                            <h3 className="text-sm font-medium text-white mb-4">Change Password</h3>
                                            <div className="space-y-4">
                                                <input type="password" placeholder="Current Password" className="w-full bg-[#121212] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50" />
                                                <input type="password" placeholder="New Password" className="w-full bg-[#121212] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50" />
                                                <Button variant="ghost" className="bg-white/5 hover:bg-white/10">Update Password</Button>
                                            </div>
                                        </div>

                                        <div className="p-5 border border-white/10 rounded-xl bg-black/20">
                                            <h3 className="text-sm font-medium text-white mb-4">Connected Accounts</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">G</div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">Google</p>
                                                            <p className="text-xs text-gray-400">{linkedAccounts.find(a => a.provider === "google") ? "Connected" : "Not connected"}</p>
                                                        </div>
                                                    </div>
                                                    {linkedAccounts.find(a => a.provider === "google") ? (
                                                        <Button variant="ghost" size="sm" onClick={() => handleUnlink("google")} className="text-red-400 hover:bg-red-500/10">Unlink</Button>
                                                    ) : (
                                                        <Button variant="ghost" size="sm" onClick={() => signIn("google", { callbackUrl: "/profile" })} className="text-[#3B82F6] hover:bg-[#3B82F6]/10">Connect</Button>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/20">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#5865F2]/20 flex items-center justify-center font-bold text-[#5865F2]">D</div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">Discord</p>
                                                            <p className="text-xs text-gray-400">{linkedAccounts.find(a => a.provider === "discord") ? "Connected" : "Not connected"}</p>
                                                        </div>
                                                    </div>
                                                    {linkedAccounts.find(a => a.provider === "discord") ? (
                                                        <Button variant="ghost" size="sm" onClick={() => handleUnlink("discord")} className="text-red-400 hover:bg-red-500/10">Unlink</Button>
                                                    ) : (
                                                        <Button variant="ghost" size="sm" onClick={() => signIn("discord", { callbackUrl: "/profile" })} className="text-[#3B82F6] hover:bg-[#3B82F6]/10">Connect</Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 border border-red-500/20 rounded-xl bg-red-500/5">
                                            <h3 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h3>
                                            <p className="text-xs text-red-400/70 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                            <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/20">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
