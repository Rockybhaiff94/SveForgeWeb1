'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from './CommandPalette';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: any;
}

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <div className="admin-body" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="admin-content" style={{
        flexGrow: 1,
        marginLeft: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        transition: 'margin-left var(--transition-speed)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Topbar 
          isSidebarCollapsed={isCollapsed} 
          onSearchClick={() => setIsCommandPaletteOpen(true)} 
        />
        
        <main style={{ flexGrow: 1, padding: '32px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={setIsCommandPaletteOpen} 
      />
    </div>
  );
}
