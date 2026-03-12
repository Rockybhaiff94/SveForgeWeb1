"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastType } from './Toast';

interface ToastData {
    id: string;
    type: ToastType;
    message: string;
    description?: string;
    duration?: number;
}

interface ToastContextType {
    toast: (type: ToastType, message: string, description?: string, duration?: number) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const toast = useCallback((type: ToastType, message: string, description?: string, duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, type, message, description, duration }]);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            
            {/* Global Portal for Toasts */}
            <div 
                aria-live="assertive" 
                className="pointer-events-none fixed inset-0 z-[100] flex items-end px-4 py-6 sm:items-start sm:p-6"
            >
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    {toasts.map((t) => (
                        <div 
                            key={t.id} 
                            className="animate-in slide-in-from-right-8 fade-in duration-300 max-w-sm w-full"
                        >
                            <Toast 
                                id={t.id} 
                                type={t.type} 
                                message={t.message} 
                                description={t.description} 
                                duration={t.duration}
                                onClose={dismiss} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
