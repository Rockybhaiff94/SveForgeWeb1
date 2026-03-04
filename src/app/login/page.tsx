"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/profile";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid email or password");
                setIsLoading(false);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                    {error}
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1" htmlFor="email">Email address</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#121212] border-white/10 rounded-lg py-2.5 px-4 text-sm text-[#9CA3AF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 transition-all"
                    placeholder="you@example.com"
                />
            </div>
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-[#9CA3AF]" htmlFor="password">Password</label>
                    <Link href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</Link>
                </div>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#121212] border-white/10 rounded-lg py-2.5 px-4 text-sm text-[#9CA3AF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 transition-all"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#60A5FA] text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isLoading ? "Signing in..." : "Sign In"}
            </button>
        </form>
    );
}

export default function LoginPage() {
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

                <Suspense fallback={<div className="h-28 animate-pulse bg-white/5 rounded-xl rounded-b-none border border-white/10 mb-6"></div>}>
                    <OAuthButtons />
                </Suspense>

                <div className="flex items-center gap-4 my-6">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Or continue with</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]"></div></div>}>
                    <LoginForm />
                </Suspense>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Don't have an account?{" "}
                    <Suspense fallback={<span>Sign up</span>}>
                        <SignUpLink />
                    </Suspense>
                </p>
            </div>
        </div>
    );
}

function SignUpLink() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const href = callbackUrl ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/signup";

    return (
        <Link href={href} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign up
        </Link>
    );
}
