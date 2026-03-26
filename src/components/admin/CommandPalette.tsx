'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, Server, Users, Terminal, Settings, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose((prev: boolean) => !prev);
      }
      if (e.key === 'Escape') {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const actions = [
    { icon: LayoutDashboard, label: 'Go to Dashboard', shortcut: 'G D', path: '/admin' },
    { icon: Server, label: 'Manage Servers', shortcut: 'G S', path: '/admin/servers' },
    { icon: Users, label: 'Manage Users', shortcut: 'G U', path: '/admin/users' },
    { icon: Terminal, label: 'View System Logs', shortcut: 'G L', path: '/admin/logs' },
    { icon: Settings, label: 'Platform Settings', shortcut: 'G P', path: '/admin/settings' },
  ];

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
        onClick={() => onClose(false)}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            width: '100%',
            maxWidth: '600px',
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Search size={20} color="#94a3b8" />
            <input 
              autoFocus
              type="text" 
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flexGrow: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '0 16px',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            <div style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
              ESC
            </div>
          </div>

          <div style={{ padding: '8px', maxHeight: '400px', overflowY: 'auto' }}>
            <p style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Suggested Actions
            </p>
            {filteredActions.map((action, index) => (
              <div 
                key={action.path}
                onClick={() => {
                  router.push(action.path);
                  onClose(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  background: index === 0 && query !== '' ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '6px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', color: '#94a3b8' }}>
                    <action.icon size={18} />
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>{action.label}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                  {action.shortcut}
                </div>
              </div>
            ))}
            {filteredActions.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                No results found for "{query}"
              </div>
            )}
          </div>

          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.5)' }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Command size={12} /> + K to toggle</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>ENTER to select</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;
