import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function OAuthButtons() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState<"google" | "discord" | null>(null);

    return (
        <div className="flex flex-col gap-3 w-full">
            <button
                type="button"
                disabled={true}
                title="Google login is currently disabled"
                className="relative flex items-center justify-center w-full px-4 py-2.5 space-x-3 text-sm font-medium text-white/40 bg-[#121212] border border-white/5 rounded-xl cursor-not-allowed group overflow-hidden"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#2563EB]/10 to-[#3B82F6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isLoading === "google" ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                )}
                <span className="relative z-10">Continue with Google</span>
            </button>

            <a
                href="/api/auth/discord"
                className="relative flex items-center justify-center w-full px-4 py-2.5 space-x-3 text-sm font-medium text-white bg-[#5865F2]/20 border border-[#5865F2]/30 rounded-xl hover:bg-[#5865F2]/40 hover:border-[#5865F2]/50 hover:shadow-[0_0_15px_rgba(88,101,242,0.4)] transition-all duration-300 group overflow-hidden"
            >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02C2.05 11.11.5 16.36 1.39 21.58c0 .02.01.03.03.04c1.77 1.3 3.47 2.08 5.12 2.6a.09.09 0 0 0 .1-.03c.4-.54.77-1.11 1.1-1.71c.02-.04 0-.09-.04-.11a11.17 11.17 0 0 1-1.63-.77c-.04-.02-.05-.06-.02-.09c.11-.08.23-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.08.22.17.34.25c.03.03.02.07-.02.09a11.36 11.36 0 0 1-1.64.77c-.04.01-.05.06-.04.11c.32.6.7 1.17 1.1 1.71c.02.03.06.04.1.03c1.65-.52 3.35-1.3 5.12-2.6c.02-.01.03-.02.03-.04c1.03-5.92-.93-11.07-3.32-16.23c-.02-.01-.03-.02-.03-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
                </svg>
                <span className="relative z-10">Continue with Discord</span>
            </a>
        </div>
    );
}
