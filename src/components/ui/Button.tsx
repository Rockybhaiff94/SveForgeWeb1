import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "glow" | "danger";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
        const variants = {
            default: "bg-[#3B82F6]/90 backdrop-blur-sm text-white hover:bg-[#60A5FA] shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] hover:-translate-y-0.5 transition-all duration-200 border border-transparent",
            outline: "border border-white/10 bg-transparent hover:bg-[#3B82F6]/10 hover:border-[#3B82F6] text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-200",
            ghost: "bg-transparent hover:bg-white/5 text-[#9CA3AF] hover:text-white transition-all duration-200",
            glow: "relative bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_35px_rgba(59,130,246,0.7)] transition-all duration-300 hover:-translate-y-0.5 bg-[length:200%_auto] hover:bg-[position:right_center]",
            danger: "bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 hover:text-red-300 border border-[#ef4444]/30 hover:border-[#ef4444]/50 transition-all duration-200",
        };

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3 text-sm",
            lg: "h-11 rounded-md px-8 text-lg font-medium",
            icon: "h-10 w-10",
        };

        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : null}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
