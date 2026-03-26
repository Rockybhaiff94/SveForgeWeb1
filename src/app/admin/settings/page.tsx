'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/admin/GlassCard';
import { Globe, Bell, Cpu, Lock, Shield, Save } from 'lucide-react';

const SettingItem = ({ icon: Icon, title, description, children }: any) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: '20px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  }}>
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', color: 'var(--text-secondary)' }}>
        <Icon size={20} />
      </div>
      <div>
        <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'white' }}>{title}</p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{description}</p>
      </div>
    </div>
    <div>{children}</div>
  </div>
);

export default function SettingsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white' }}>Platform Settings</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Global configuration and security controls for ServerForge.</p>
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
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '24px' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['General', 'Security', 'Nodes', 'Billing', 'API Keys', 'Audit Log'].map((item, idx) => (
            <button key={item} style={{ 
              padding: '12px 16px', 
              textAlign: 'left',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: idx === 0 ? 600 : 500,
              background: idx === 0 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: idx === 0 ? 'var(--primary)' : 'var(--text-secondary)',
              border: idx === 0 ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
              cursor: 'pointer'
            }}>
              {item}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <GlassCard title="General Configuration">
             <SettingItem icon={Globe} title="Platform Name" description="The public-facing name of your management console.">
               <input type="text" defaultValue="ServerForge Cloud" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: 'white', outline: 'none' }} />
             </SettingItem>
             <SettingItem icon={Bell} title="System Notifications" description="Global broadcast for maintenance or updates.">
                <div style={{ width: '40px', height: '20px', background: 'var(--primary)', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                   <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }} />
                </div>
             </SettingItem>
             <SettingItem icon={Cpu} title="Resource Monitoring" description="Interval for real-time telemetry updates (seconds).">
                <input type="number" defaultValue="5" style={{ width: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: 'white' }} />
             </SettingItem>
          </GlassCard>

          <GlassCard title="Security & Compliance">
             <SettingItem icon={Lock} title="Two-Factor Authentication" description="Enforce 2FA for all administrative accounts.">
               <div style={{ width: '40px', height: '20px', background: '#334155', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                   <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', left: '2px', top: '2px' }} />
                </div>
             </SettingItem>
             <SettingItem icon={Shield} title="RBAC Policy" description="Manage default permissions for new moderators.">
                <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer' }}>Configure Policy</button>
             </SettingItem>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
