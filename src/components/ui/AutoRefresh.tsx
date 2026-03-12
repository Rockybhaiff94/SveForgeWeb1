"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AutoRefreshProps {
    intervalMs?: number;
}

/**
 * Invisible client component that triggers a Next.js soft refresh periodically.
 * This ensures Server Components (like public server grids) re-fetch fresh database content.
 */
export function AutoRefresh({ intervalMs = 60000 }: AutoRefreshProps) {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, intervalMs);

        return () => clearInterval(interval);
    }, [router, intervalMs]);

    return null;
}
