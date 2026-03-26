'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/admin/GlassCard';
import { Users as UsersIcon, Shield, Mail, UserPlus, MoreHorizontal } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex@serverforge.com', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Sarah Miller', email: 'sarah@serverforge.com', role: 'Moderator', status: 'Active' },
    { id: 3, name: 'Michael Chen', email: 'mchen@serverforge.com', role: 'Admin', status: 'Inactive' },
    { id: 4, name: 'Emma Wilson', email: 'emma@serverforge.com', role: 'Moderator', status: 'Active' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white' }}>User Management</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Manage administrators and moderators permissions.</p>
        </div>
        <button className="glass-button" style={{ 
          padding: '10px 18px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}>
          <UserPlus size={18} />
          <span>Invite Team Member</span>
        </button>
      </header>

      <GlassCard title="Team Members" subtitle="Active users with administrative access">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>USER</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>ROLE</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>STATUS</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 600 }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
                      <Shield size={14} color="var(--primary)" />
                      {user.role}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      color: user.status === 'Active' ? '#22c55e' : '#94a3b8',
                      padding: '2px 8px',
                      background: user.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                      borderRadius: '12px'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
