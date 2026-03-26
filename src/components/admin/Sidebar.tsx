'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Server,
  Users,
  Terminal,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarItemProps {
  icon: any;
  label: string;
  to: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, isCollapsed }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link
      href={to}
      className={`sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 16px',
        margin: '2px 12px',
        borderRadius: '6px',
        color: isActive ? 'white' : '#94a3b8',
        background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          style={{
            position: 'absolute',
            left: 0,
            top: '20%',
            bottom: '20%',
            width: '3px',
            backgroundColor: '#6366f1',
            borderRadius: '0 4px 4px 0'
          }}
        />
      )}
      <Icon size={18} style={{ minWidth: '18px', opacity: isActive ? 1 : 0.7 }} />
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginLeft: '12px',
            fontWeight: isActive ? 500 : 400,
            fontSize: '0.9rem',
            letterSpacing: '0.01em'
          }}
        >
          {label}
        </motion.span>
      )}
    </Link>
  );
};

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
    { icon: Server, label: 'Servers', to: '/admin/servers' },
    { icon: Users, label: 'Users', to: '/admin/users' },
    { icon: Terminal, label: 'Logs', to: '/admin/logs' },
    { icon: Settings, label: 'Settings', to: '/admin/settings' },
  ];

  return (
    <aside className="sidebar-container" style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
      backgroundColor: '#05070a',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      transition: 'width var(--transition-speed)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="sidebar-header" style={{
        padding: '28px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between'
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              background: '#6366f1',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={16} color="white" />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', letterSpacing: '-0.01em' }}>
              ServerForge
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            color: '#64748b',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
            cursor: 'pointer'
          }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav style={{ flexGrow: 1, marginTop: '20px' }}>
        {menuItems.map((item) => (
          <SidebarItem key={item.to} {...item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      <div className="sidebar-footer" style={{ padding: '16px' }}>
        <div style={{
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e293b' }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #05070a'
            }} />
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'white', whiteSpace: 'nowrap' }}>Admin User</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
