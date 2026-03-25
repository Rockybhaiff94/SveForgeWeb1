"use client";

import React, { useState, useRef, useEffect } from "react";
import { Server, Image as ImageIcon, Link as LinkIcon, CheckCircle2, ChevronRight, ChevronLeft, UploadCloud, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastContext";
import { useRouter, useParams } from "next/navigation";

export default function EditServerPage() {
    const { slug } = useParams();
    const serverId = Array.isArray(slug) ? slug[0] : slug;
    
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
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
    
    const { toast, dismiss } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState({ banner: false, logo: false });
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!serverId) return;
        const fetchServer = async () => {
            try {
                const res = await fetch(`/api/servers/${serverId}`);
                const data = await res.json();
                if (res.ok && data.success) {
                    const s = data.server;
                    setFormData({
                        name: s.serverName || "",
                        gameType: s.gameType || "Minecraft",
                        serverIP: s.ip || "",
                        port: s.port ? s.port.toString() : "",
                        description: s.description || "",
                        tags: Array.isArray(s.tags) ? s.tags.join(', ') : (s.tags || ""),
                        bannerImage: s.bannerImage || "",
                        logoImage: s.logoImage || "",
                        discordURL: s.discordURL || "",
                        websiteURL: s.websiteURL || "",
                    });
                } else {
                    toast('error', 'Error Loading Server', data.error || 'Failed to fetch server details.');
                    router.push('/dashboard/servers');
                }
            } catch (err) {
                toast('error', 'Error', 'Failed to connect to the server API.');
                router.push('/dashboard/servers');
            } finally {
                setIsLoading(false);
            }
        };
        fetchServer();
    }, [serverId, router, toast]);

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        const submitToastId = toast('loading', 'Updating server details...', 'Please wait while we apply your changes.', 0);

        try {
            const res = await fetch(`/api/servers/${serverId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            dismiss(submitToastId);

            if (!res.ok) throw new Error(data.error || 'Failed to update server');

            toast('success', data.message || 'Server Updated Successfully!', 'Your changes have been applied immediately.');
            setTimeout(() => {
                router.refresh();
                router.push('/dashboard/servers');
            }, 1500);
        } catch (error: any) {
            console.error('Submission error:', error);
            if (submitToastId) dismiss(submitToastId);
            toast('error', 'Server Update Failed', error.message || 'An unexpected error occurred. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'logo') => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        if (!file.type.startsWith('image/')) {
            toast('error', 'Invalid File Type', 'Please select an image file (PNG, JPG, WEBP).');
            return;
        }

        setIsUploading((prev) => ({ ...prev, [type]: true }));
        const uploadToastId = toast('loading', `Uploading ${type === 'banner' ? 'Banner' : 'Logo'}...`, 'Please wait while we process this image to the cloud.', 0);

        try {
            let data;
            try {
                const res = await fetch('/api/upload/url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: file.name, fileType: file.type })
                });
                data = await res.json();
            } catch (err: any) {
                throw new Error(`API connection failed: ${err.message}`);
            }
            
            if (!data?.success) throw new Error(data?.error || 'Failed to get upload URL');

            try {
                const uploadRes = await fetch(data.uploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type },
                });
                if (!uploadRes.ok) throw new Error(`Failed to upload to Amazon S3 (HTTP ${uploadRes.status})`);
            } catch (err: any) {
                if (err.message === 'Failed to fetch') {
                    throw new Error('AWS S3 CORS Error Blocked the Upload.');
                }
                throw err;
            }

            setFormData(prev => ({ ...prev, [type === 'banner' ? 'bannerImage' : 'logoImage']: data.publicUrl }));
            dismiss(uploadToastId);
            toast('success', `Upload Complete`, `Your ${type} has been securely stored in AWS S3.`);
        } catch (error: any) {
            console.error('Upload error:', error);
            dismiss(uploadToastId);
            toast('error', 'Upload Failed', error.message || 'An error occurred during upload.');
        } finally {
            setIsUploading((prev) => ({ ...prev, [type]: false }));
        }
    };

    const STEPS = [
        { num: 1, title: "Basic Info", icon: Server },
        { num: 2, title: "Details & Media", icon: ImageIcon },
        { num: 3, title: "Links & Review", icon: LinkIcon },
    ];

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto py-20 text-center flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-white">Loading Server Data...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10">
            {/* Header */}
            <div className="mb-10 text-center space-y-2">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Edit Your Server</h1>
                <p className="text-gray-400">Update the details of {formData.name}</p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-white/10 -z-10 -translate-y-1/2 rounded-full" />
                <div
                    className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                    style={{ '--progress-width': `${((step - 1) / 2) * 100}%`, width: 'var(--progress-width)' } as React.CSSProperties}
                />

                {STEPS.map((s) => (
                    <div key={s.num} className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors ${step >= s.num ? "bg-[#121212] border-[#3B82F6] text-[#3B82F6]" : "bg-[#121212] border-white/10 text-gray-500"}`}>
                            {step > s.num ? <CheckCircle2 className="w-6 h-6 text-[#10B981]" /> : <s.icon className="w-5 h-5" />}
                        </div>
                        <span className={`text-xs font-bold ${step >= s.num ? "text-white" : "text-gray-500"}`}>{s.title}</span>
                    </div>
                ))}
            </div>

            {/* Form Container */}
            <div className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3B82F6]/10 blur-[120px] rounded-full pointer-events-none" />

                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                    {/* STEP 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Basic Information</h2>

                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-semibold text-[#9CA3AF]">Server Name <span className="text-red-400">*</span></label>
                                <input
                                    id="name"
                                    type="text" name="name" value={formData.name} onChange={handleChange}
                                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="gameType" className="text-sm font-semibold text-[#9CA3AF]">Game Type <span className="text-red-400">*</span></label>
                                <select
                                    id="gameType"
                                    name="gameType" value={formData.gameType} onChange={handleChange}
                                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 appearance-none"
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
                                    <label htmlFor="serverIP" className="text-sm font-semibold text-[#9CA3AF]">Server IP/Hostname <span className="text-red-400">*</span></label>
                                    <input
                                        id="serverIP"
                                        type="text" name="serverIP" value={formData.serverIP} onChange={handleChange}
                                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="port" className="text-sm font-semibold text-[#9CA3AF]">Port</label>
                                    <input
                                        id="port"
                                        type="text" name="port" value={formData.port} onChange={handleChange}
                                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 font-mono"
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
                                <label htmlFor="description" className="text-sm font-semibold text-[#9CA3AF] flex justify-between">
                                    <span>Description <span className="text-red-400">*</span></span>
                                    <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Markdown Supported</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description" rows={6} value={formData.description} onChange={handleChange}
                                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 resize-y font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="tags" className="text-sm font-semibold text-[#9CA3AF]">Tags (Comma separated) <span className="text-red-400">*</span></label>
                                <input
                                    id="tags"
                                    type="text" name="tags" value={formData.tags} onChange={handleChange}
                                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="bannerImage" className="text-sm font-semibold text-[#9CA3AF]">Banner Image (16:9)</label>
                                    <input id="bannerImage" type="file" accept="image/*" className="hidden" ref={bannerInputRef} onChange={(e) => handleImageUpload(e, 'banner')} />
                                    {formData.bannerImage ? (
                                        <div className="relative w-full h-32 md:h-40 rounded-xl overflow-hidden border border-white/10 group">
                                            <img src={formData.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button type="button" variant="ghost" className="text-red-400" onClick={() => setFormData(prev => ({ ...prev, bannerImage: '' }))}>
                                                    <X className="w-5 h-5 mr-2" /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div onClick={() => bannerInputRef.current?.click()} className="w-full h-32 md:h-40 border-2 border-dashed border-white/20 hover:border-[#3B82F6]/50 rounded-xl bg-[#121212]/50 cursor-pointer flex flex-col items-center justify-center space-y-3">
                                            {isUploading.banner ? <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" /> : <><UploadCloud className="w-8 h-8 text-gray-400" /><p className="text-sm text-gray-300">Click to upload banner</p></>}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="logoImage" className="text-sm font-semibold text-[#9CA3AF]">Logo Image (1:1)</label>
                                    <input id="logoImage" type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'logo')} />
                                    {formData.logoImage ? (
                                        <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0 rounded-xl overflow-hidden border border-white/10 group">
                                            <img src={formData.logoImage} alt="Logo Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button type="button" variant="ghost" className="text-red-400" onClick={() => setFormData(prev => ({ ...prev, logoImage: '' }))}>
                                                    <X className="w-5 h-5 mr-2" /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div onClick={() => logoInputRef.current?.click()} className="w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0 border-2 border-dashed border-white/20 hover:border-[#3B82F6]/50 rounded-xl bg-[#121212]/50 cursor-pointer flex flex-col items-center justify-center space-y-3">
                                            {isUploading.logo ? <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" /> : <><UploadCloud className="w-8 h-8 text-gray-400" /><p className="text-sm text-gray-300">Upload Logo</p></>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Links & Review */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Social Links</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="discordURL" className="text-sm font-semibold text-[#5865F2]">Discord URL</label>
                                    <input
                                        id="discordURL" type="url" name="discordURL" value={formData.discordURL} onChange={handleChange}
                                        className="w-full bg-[#121212] border border-[#5865F2]/30 focus:border-[#5865F2]/80 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="websiteURL" className="text-sm font-semibold text-[#9CA3AF]">Website URL</label>
                                    <input
                                        id="websiteURL" type="url" name="websiteURL" value={formData.websiteURL} onChange={handleChange}
                                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
                                    />
                                </div>
                            </div>

                            <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-4 mt-8 flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-[#10B981]">Ready to Save Changes?</h4>
                                    <p className="text-xs text-[#10B981]/80 mt-1">
                                        Note: If you change your Server IP or Port, it might briefly display as OFFLINE until the verification pinger updates your status naturally.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-8">
                        <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 1} className={step === 1 ? "opacity-0" : ""}>
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        {step < 3 ? (
                            <Button type="button" variant="glow" onClick={nextStep} className="px-8 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                Next Step <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button type="submit" variant="glow" disabled={isSubmitting} className="px-8 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all min-w-[180px]">
                                {isSubmitting ? <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Saving Changes...</> : <><CheckCircle2 className="w-5 h-5 mr-2" /> Save Details</>}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
