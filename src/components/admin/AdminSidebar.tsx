"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Server, FileText, Settings, Shield } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Servers', href: '/admin/servers', icon: Server },
    { name: 'Logs', href: '/admin/logs', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Permissions', href: '/admin/permissions', icon: Shield },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800 hidden md:flex flex-col flex-shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-zinc-800 shrink-0">
                <span className="text-xl font-bold text-white tracking-wide">ServerForge <span className="text-zinc-500 text-sm tracking-normal">Admin</span></span>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                        return (
                            <li key={item.name}>
                                <Link 
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                                        isActive 
                                        ? 'bg-indigo-600/10 text-indigo-400' 
                                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
