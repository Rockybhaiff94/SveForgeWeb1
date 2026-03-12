import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    description?: string;
    duration?: number;
    onClose: (id: string) => void;
}

export function Toast({ id, type, message, description, duration = 5000, onClose }: ToastProps) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => onClose(id), duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        error: <AlertCircle className="w-5 h-5 text-rose-500" />,
        info: <Info className="w-5 h-5 text-blue-400" />
    };

    const containerStyles = {
        success: 'bg-[#0f172a] border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
        error: 'bg-[#0f172a] border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
        info: 'bg-[#0f172a] border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
    };

    return (
        <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border p-4 ${containerStyles[type]} flex items-start gap-4 transition-all hover:scale-[1.02] shadow-xl backdrop-blur-xl relative group`}>
            {/* Glow effect matching theme */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none ${
                type === 'success' ? 'bg-gradient-to-br from-emerald-500/10 to-transparent' : 
                type === 'error' ? 'bg-gradient-to-br from-rose-500/10 to-transparent' : 
                'bg-gradient-to-br from-blue-500/10 to-transparent'
            }`} />

            <div className="shrink-0 mt-0.5">
                {icons[type]}
            </div>
            
            <div className="flex-1 min-w-0 pr-6 relative z-10">
                <p className={`text-sm font-semibold truncate ${
                    type === 'success' ? 'text-emerald-100' :
                    type === 'error' ? 'text-rose-100' :
                    'text-blue-100'
                }`}>
                    {message}
                </p>
                {description && (
                    <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            <div className="shrink-0 flex self-start relative z-10 -mr-2">
                <button
                    onClick={() => onClose(id)}
                    className="inline-flex rounded-md p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 focus:outline-none transition-colors"
                >
                    <span className="sr-only">Close</span>
                    <X className="h-4 w-4" />
                </button>
            </div>
            
            {/* Animated progress bar visualizing duration */}
            {duration > 0 && (
                <div 
                    className={`absolute bottom-0 left-0 h-0.5 animate-shrink ${
                        type === 'success' ? 'bg-emerald-500/50' : 
                        type === 'error' ? 'bg-rose-500/50' : 
                        'bg-blue-500/50'
                    }`}
                    style={{ animationDuration: `${duration}ms`, animationName: 'shrinkWidth', animationTimingFunction: 'linear', animationFillMode: 'forwards' }}
                />
            )}
            
            <style jsx>{`
                @keyframes shrinkWidth {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-shrink {
                    animation-name: shrinkWidth;
                }
            `}</style>
        </div>
    );
}
