import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "success" | "danger" | "outline" | "glow";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
        success: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
        danger: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
        outline: "text-[#9CA3AF] border-white/20 hover:border-white/40",
        glow: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30 shadow-[0_0_10px_rgba(249,115,22,0.4)]",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge };
