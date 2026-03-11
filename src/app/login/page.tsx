"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

function LoginMessage({ error }: { error: string | null }) {
    const errorMessages: Record<string, string> = {
        'auth_failed': 'Authentication failed. Please check your Discord settings and try again.',
        'no_code': 'No authorization code received from Discord.',
        'config_error': 'Server configuration error. Please contact the administrator.',
        'default': 'An error occurred during login. Please try again.'
    };

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-2 mb-6">
                <p className="text-sm text-red-400 text-center font-bold">
                    {errorMessages[error] || errorMessages.default}
                </p>
                <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
                    Reference: {error}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl space-y-2">
            <p className="text-sm text-gray-300 text-center">
                Email/Password login is currently unavailable.
            </p>
            <p className="text-xs text-blue-400 text-center font-bold uppercase tracking-widest">
                Please use Discord to continue
            </p>
        </div>
    );
}

export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB] to-[#3B82F6]"></div>

                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] mb-4">
                        <span className="font-bold text-white text-2xl">S</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-gray-400 text-sm mt-2">Log in to your ServerForge account</p>
                </div>

                <Suspense fallback={<div className="h-14 animate-pulse bg-white/5 rounded-xl border border-white/10 mb-6"></div>}>
                    <OAuthButtons />
                </Suspense>

                <div className="flex items-center gap-4 my-8">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Maintenance</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <LoginMessage error={error} />

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-xs text-gray-500">
                        By logging in, you agree to our <Link href="/terms" className="text-gray-400 hover:text-white underline">Terms</Link> and <Link href="/privacy" className="text-gray-400 hover:text-white underline">Privacy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
