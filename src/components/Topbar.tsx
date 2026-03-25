'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, UserCircle, Menu, LogOut } from 'lucide-react';
import { Button } from './ui/button';

export function Topbar({ user, onMenuClick }: { user: any, onMenuClick?: () => void }) {
  return (
    <header className="h-16 flex items-center justify-between border-b border-[#2b2d31] bg-[#1e1f22] px-6 z-10">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button variant="ghost" size="sm" className="md:hidden" onClick={onMenuClick}>
            <Menu size={20} />
          </Button>
        )}
        <h2 className="text-lg font-semibold text-gray-200">Admin Panel</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 rounded-md">
            <UserCircle size={28} className="text-gray-300" />
            <div className="hidden md:block text-left text-sm text-gray-300">
              <p className="font-medium leading-none">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500 mt-1">{user?.role || 'STAFF'}</p>
            </div>
          </div>
          
          <div className="h-6 w-px bg-[#2b2d31]" />
          
          <Link 
            href="/api/auth/logout" 
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
