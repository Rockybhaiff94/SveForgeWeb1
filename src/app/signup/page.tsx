"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/profile";

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Register user
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Registration failed");
            }

            // Auto sign in upon successful registration
            const signInRes = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (signInRes?.error) {
                throw new Error("Registration succeeded but sign-in failed. Please log in manually.");
            }

            // Redirect to appropriate context
            router.push(callbackUrl);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
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
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1" htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-[#121212] border border-white/10 rounded-lg py-2.5 px-4 text-sm text-[#9CA3AF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 transition-all"
                    placeholder="johndoe"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1" htmlFor="email">Email address</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#121212] border border-white/10 rounded-lg py-2.5 px-4 text-sm text-[#9CA3AF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 transition-all"
                    placeholder="you@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#121212] border border-white/10 rounded-lg py-2.5 px-4 text-sm text-[#9CA3AF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 transition-all"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#60A5FA] text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
        </form>
    );
}

export default function SignUpPage() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB] to-[#3B82F6]"></div>

                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] mb-4">
                        <span className="font-bold text-white text-2xl">S</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Create an Account</h1>
                    <p className="text-gray-400 text-sm mt-2">Join the ServerForge community</p>
                </div>

                <Suspense fallback={<div className="h-28 animate-pulse bg-white/5 rounded-xl rounded-b-none border border-white/10 mb-6"></div>}>
                    <OAuthButtons />
                </Suspense>

                <div className="flex items-center gap-4 my-6">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Or continue with</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <Suspense fallback={<div className="h-72 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]"></div></div>}>
                    <SignUpForm />
                </Suspense>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Already have an account?{" "}
                    <Suspense fallback={<span>Log in</span>}>
                        <LoginLink />
                    </Suspense>
                </p>
            </div>
        </div>
    );
}

function LoginLink() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const href = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";

    return (
        <Link href={href} className="text-[#3B82F6] hover:text-[#60A5FA] font-medium transition-colors">
            Log in
        </Link>
    );
}
