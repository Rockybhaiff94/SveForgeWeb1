"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const router = useRouter();

    useEffect(() => {
        // Since we are using Discord OAuth for everything, signup and login are the same flow.
        router.replace("/login");
    }, [router]);

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 items-center justify-center flex">
                    <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-500 font-black uppercase tracking-widest">Redirecting to Secure Login...</p>
            </div>
        </div>
    );
}

