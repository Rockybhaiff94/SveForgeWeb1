import Link from "next/link";
import { Lock, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginRequiredPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-panel p-10 rounded-[32px] border border-white/5 text-center relative overflow-hidden space-y-8">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600 opacity-10 blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 space-y-6">
                    <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-[24px] flex items-center justify-center mx-auto shadow-xl shadow-blue-500/5">
                        <Lock className="w-10 h-10 text-blue-400" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-white tracking-tight">Access Restricted</h1>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            You must log in to access this feature. Join the ServerForge community to manage servers and track analytics.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Link href="/login">
                            <button className="w-full px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group">
                                Log In Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                        <Link href="/home">
                            <button className="w-full px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2">
                                <Home className="w-4 h-4" /> Back to Home
                            </button>
                        </Link>
                    </div>
                </div>

                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] relative z-10 pt-4">
                    ServerForge Security System v3
                </p>
            </div>
        </div>
    );
}
