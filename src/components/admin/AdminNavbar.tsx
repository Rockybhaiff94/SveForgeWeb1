import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function AdminNavbar() {
    return (
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-400">Admin Panel</span>
            </div>
            
            <div className="flex items-center gap-4">
                <button aria-label="Notifications" className="text-zinc-400 hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:bg-indigo-500 transition-colors">
                    AD
                </div>
            </div>
        </header>
    );
}
