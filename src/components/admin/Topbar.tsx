'use client';

import React from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
  Menu, 
  Command,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';

interface TopbarProps {
  isSidebarCollapsed: boolean;
  onSearchClick?: () => void;
}

const Topbar = ({ isSidebarCollapsed, onSearchClick }: TopbarProps) => {
  return (
    <header className="glass-navbar" style={{
      height: 'var(--navbar-height)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div className="search-container" style={{ position: 'relative', width: '380px' }}>
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-secondary)',
          display: 'flex'
        }}>
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search for servers, users, or logs... (Ctrl+K)"
          onClick={onSearchClick}
          readOnly={!!onSearchClick}
          style={{
            width: '100%',
            height: '42px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '0 12px 0 42px',
            color: 'white',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'all 0.2s ease',
            cursor: onSearchClick ? 'pointer' : 'text'
          }}
        />
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 6px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          color: 'var(--text-secondary)',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          <Command size={12} />
          <span>K</span>
        </div>
      </div>

      <div className="topbar-actions" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button className="topbar-btn" title="System Health" style={{ 
          color: 'var(--text-secondary)', 
          padding: '8px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          background: 'transparent',
          position: 'relative',
          cursor: 'pointer'
        }}>
          <Bell size={20} />
          <div style={{ 
            position: 'absolute', 
            top: '8px', 
            right: '8px',
            width: '8px', 
            height: '8px', 
            background: '#ef4444', 
            borderRadius: '50%',
            border: '2px solid #05070a'
          }} />
        </button>

        <button className="topbar-btn" style={{ 
          color: 'var(--text-secondary)', 
          padding: '8px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Sun size={20} />
        </button>

        <div style={{ 
            width: '1px', 
            height: '24px', 
            background: 'rgba(255, 255, 255, 0.1)',
            margin: '0 8px'
        }} />

        <div className="user-profile-btn" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 12px',
          borderRadius: '12px',
          cursor: 'pointer',
          border: '1px solid transparent',
          transition: 'all 0.2s'
        }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.8rem' }}>
            AD
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white' }}>Admin</span>
          </div>
          <ChevronDown size={14} color="var(--text-secondary)" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
