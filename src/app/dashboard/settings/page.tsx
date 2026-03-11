import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth-util";
import { Settings, User, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function SettingsPage() {
    const user = await getSessionUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <Settings className="w-8 h-8 text-[#A855F7]" /> Account Settings
                </h1>
                <p className="text-gray-400 mt-1">Manage your account preferences, security, and linked providers.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* PROFILE SETTINGS */}
                <div className="glass-panel p-8 rounded-[28px] border border-white/5 bg-white/[0.01] space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-3 border-b border-white/5 pb-4">
                        <User className="w-5 h-5 text-blue-500" /> General Profile
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Username</label>
                            <input
                                type="text"
                                defaultValue={user.username || user.name || ""}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Public Email</label>
                            <input
                                type="email"
                                defaultValue={user.email || ""}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>
                    </div>
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/10">
                        Update Profile
                    </button>
                </div>

                {/* LOGIN PROVIDERS */}
                <div className="glass-panel p-8 rounded-[28px] border border-white/5 bg-white/[0.01] space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-3 border-b border-white/5 pb-4">
                        <Globe className="w-5 h-5 text-orange-500" /> Login Providers
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    {user.provider === 'google' ? (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02C2.05 11.11.5 16.36 1.39 21.58c0 .02.01.03.03.04c1.77 1.3 3.47 2.08 5.12 2.6a.09.09 0 0 0 .1-.03c.4-.54.77-1.11 1.1-1.71c.02-.04 0-.09-.04-.11a11.17 11.17 0 0 1-1.63-.77c-.04-.02-.05-.06-.02-.09c.11-.08.23-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.08.22.17.34.25c.03.03.02.07-.02.09a11.36 11.36 0 0 1-1.64.77c-.04.01-.05.06-.04.11c.32.6.7 1.17 1.1 1.71c.02.03.06.04.1.03c1.65-.52 3.35-1.3 5.12-2.6c.02-.01.03-.02.03-.04c1.03-5.92-.93-11.07-3.32-16.23c-.02-.01-.03-.02-.03-.02z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white capitalize">{user.provider} Account</p>
                                    <p className="text-xs text-green-500/80 mt-0.5">Primary Connection</p>
                                </div>
                            </div>
                            <span className="text-[10px] items-center flex gap-1 font-black text-gray-500 uppercase tracking-widest px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                                <Lock className="w-3 h-3" /> Managed by {user.provider}
                            </span>
                        </div>
                    </div>
                </div>

                {/* PREFERENCES */}
                <div className="glass-panel p-8 rounded-[28px] border border-white/5 bg-white/[0.01] space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-3 border-b border-white/5 pb-4">
                        <Lock className="w-5 h-5 text-green-500" /> Preferences
                    </h3>

                    <div className="space-y-4">
                        {[
                            { label: "Email Notifications", desc: "Receive alerts for server bumps and system updates.", default: true },
                            { label: "Public Profile", desc: "Allow other users to see your registered servers.", default: true },
                            { label: "Community Messages", desc: "Receive messages from other server owners.", default: false },
                        ].map((pref, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-white">{pref.label}</p>
                                    <p className="text-xs text-gray-500">{pref.desc}</p>
                                </div>
                                <div className={cn(
                                    "w-10 h-5 rounded-full p-1 cursor-pointer transition-colors",
                                    pref.default ? "bg-blue-600" : "bg-white/10"
                                )}>
                                    <div className={cn(
                                        "w-3 h-3 bg-white rounded-full transition-transform",
                                        pref.default ? "translate-x-5" : "translate-x-0"
                                    )}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
