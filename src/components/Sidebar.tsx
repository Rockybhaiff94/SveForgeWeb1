'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Server, FileText, Settings, ShieldAlert, Terminal } from 'lucide-react';
import React from 'react';

const routes = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/servers', label: 'Servers', icon: Server },
  { href: '/admin/logs', label: 'Logs', icon: FileText },
  { href: '/admin/permissions', label: 'Permissions', icon: ShieldAlert },
  { href: '/admin/moderation', label: 'Queue', icon: ShieldAlert },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/dev-tools', label: 'Dev Tools', icon: Terminal },
];

export function Sidebar({ user, isMobile = false }: { user?: any, isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col h-full bg-[#1e1f22] border-r border-[#2b2d31] ${isMobile ? 'w-full' : 'w-64'}`}>
      <div className="flex h-16 items-center border-b border-[#2b2d31] px-6">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-[#5865F2]">
          ServerForge
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {routes.map((route) => {
          const isActive = pathname === route.href || pathname.startsWith(route.href + '/');
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive ? 'bg-[#5865F2] text-white' : 'text-gray-400 hover:bg-[#2b2d31] hover:text-gray-200'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{route.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
