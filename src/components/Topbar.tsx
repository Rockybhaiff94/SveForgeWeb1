'use client';

import React from 'react';
import { Bell, UserCircle, Menu } from 'lucide-react';
import { Button } from './ui/button';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
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
        <div className="flex items-center gap-2 cursor-pointer hover:bg-[#2b2d31] p-1.5 rounded-md transition-colors">
          <UserCircle size={28} className="text-gray-300" />
          <div className="hidden md:block text-left text-sm text-gray-300">
            <p className="font-medium leading-none">Admin User</p>
            <p className="text-xs text-gray-500 mt-1">OWNER</p>
          </div>
        </div>
      </div>
    </header>
  );
}
