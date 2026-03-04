import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = true, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "glass-panel rounded-2xl overflow-hidden transition-all duration-300",
                hoverEffect && "glass-panel-hover -translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn("font-semibold leading-none tracking-tight text-white", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className={cn("text-sm text-[#9CA3AF]", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
