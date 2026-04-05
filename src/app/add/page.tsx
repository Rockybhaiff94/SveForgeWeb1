"use client";

import React, { useState } from "react";
import { Server, Image as ImageIcon, Link as LinkIcon, CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddServerPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        gameType: "Minecraft",
        serverIP: "",
        port: "",
        description: "",
        tags: "",
        bannerImage: "",
        logoImage: "",
        discordURL: "",
        websiteURL: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/servers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            toast.success("Server submitted successfully! It will be reviewed by our team.");
            router.push("/dashboard");
            router.refresh();
        } catch (error: any) {
            toast.error("Server Submission Failed", {
                description: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const STEPS = [
        { num: 1, title: "Basic Info", icon: Server },
        { num: 2, title: "Details & Media", icon: ImageIcon },
        { num: 3, title: "Links & Review", icon: LinkIcon },
    ];

    return (
        <div className="max-w-3xl mx-auto py-10">

            {/* Header */}
            <div className="mb-10 text-center space-y-2">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Add Your Server</h1>
                <p className="text-gray-400">Join thousands of servers on ServerForge and grow your community.</p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-white/10 -z-10 -translate-y-1/2 rounded-full" />
                <div
                    className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                />

                {STEPS.map((s) => (
                    <div key={s.num} className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors ${step >= s.num ? "bg-slate-900 border-blue-500 text-blue-400" : "bg-slate-900 border-white/10 text-gray-500"}`}>
                            {step > s.num ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <s.icon className="w-5 h-5" />}
                        </div>
                        <span className={`text-xs font-bold ${step >= s.num ? "text-white" : "text-gray-500"}`}>{s.title}</span>
                    </div>
                ))}
            </div>

            {/* Form Container */}
            <div className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Glow accent */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>

                    {/* STEP 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Basic Information</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300">Server Name <span className="text-red-400">*</span></label>
                                <input
                                    type="text" name="name" value={formData.name} onChange={handleChange}
                                    placeholder="e.g. Aetherial Network"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300">Game Type <span className="text-red-400">*</span></label>
                                <select
                                    name="gameType" value={formData.gameType} onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                >
                                    <option value="Minecraft">Minecraft</option>
                                    <option value="Rust">Rust</option>
                                    <option value="FiveM">FiveM</option>
                                    <option value="Ark">Ark: Survival Evolved</option>
                                    <option value="Terraria">Terraria</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-300">Server IP/Hostname <span className="text-red-400">*</span></label>
                                    <input
                                        type="text" name="serverIP" value={formData.serverIP} onChange={handleChange}
                                        placeholder="play.example.com"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300">Port</label>
                                    <input
                                        type="text" name="port" value={formData.port} onChange={handleChange}
                                        placeholder="25565"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Details & Media */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Details & Media</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 flex justify-between">
                                    <span>Description <span className="text-red-400">*</span></span>
                                    <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Markdown Supported</span>
                                </label>
                                <textarea
                                    name="description" rows={6} value={formData.description} onChange={handleChange}
                                    placeholder="# Welcome to our server!"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300">Tags (Comma separated) <span className="text-red-400">*</span></label>
                                <input
                                    type="text" name="tags" value={formData.tags} onChange={handleChange}
                                    placeholder="Survival, Economy, PvP"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300">Banner Image URL</label>
                                    <input
                                        type="url" name="bannerImage" value={formData.bannerImage} onChange={handleChange}
                                        placeholder="https://imgur.com/... (16:9)"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300">Logo Image URL</label>
                                    <input
                                        type="url" name="logoImage" value={formData.logoImage} onChange={handleChange}
                                        placeholder="https://imgur.com/... (1:1)"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Links & Review */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Social Links & Review</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[#5865F2]">Discord Discord URL</label>
                                    <input
                                        type="url" name="discordURL" value={formData.discordURL} onChange={handleChange}
                                        placeholder="https://discord.gg/yourcode"
                                        className="w-full bg-black/40 border border-[#5865F2]/30 focus:border-[#5865F2]/80 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300">Website URL</label>
                                    <input
                                        type="url" name="websiteURL" value={formData.websiteURL} onChange={handleChange}
                                        placeholder="https://yourserver.com"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-8 flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-yellow-500">Ready to Submit?</h4>
                                    <p className="text-xs text-yellow-500/80 mt-1">
                                        By submitting your server, it will be placed in a pending state until an admin approves it to ensure quality and compliance.
                                    </p>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-8">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={prevStep}
                            disabled={step === 1}
                            className={step === 1 ? "opacity-0" : ""}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                        </Button>

                        {step < 3 ? (
                            <Button type="button" variant="glow" onClick={nextStep} className="px-8 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                Next Step <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                variant="glow" 
                                disabled={isLoading}
                                className="px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Submit Server
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
}
