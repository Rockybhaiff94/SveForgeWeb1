'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/admin/GlassCard';
import { Terminal, Search, Filter, Download, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const LogIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'error': return <AlertCircle size={14} color="#ef4444" />;
    case 'warning': return <AlertTriangle size={14} color="#eab308" />;
    case 'success': return <CheckCircle size={14} color="#22c55e" />;
    default: return <Info size={14} color="#6366f1" />;
  }
};

export default function LogsPage() {
  const logs = [
    { id: 1, timestamp: '2026-03-26 04:05:12', type: 'info', node: 'Edge-US-East', message: 'Node health check passed' },
    { id: 2, timestamp: '2026-03-26 04:02:45', type: 'error', node: 'Core-DB-01', message: 'Connection timeout on secondary partition' },
    { id: 3, timestamp: '2026-03-26 03:58:20', type: 'warning', node: 'Static-CDN', message: 'High cache miss rate detected in Tokyo' },
    { id: 4, timestamp: '2026-03-26 03:55:01', type: 'success', node: 'API-Gateway', message: 'New SSL certificate deployed' },
    { id: 5, timestamp: '2026-03-26 03:52:33', type: 'info', node: 'Autoscale-Mgr', message: 'Triggered scale-up for US-West region' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white' }}>System Logs</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Real-time audit trails and system activity logs.</p>
        </div>
        <button className="glass-button" style={{ 
          padding: '10px 18px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: 'rgba(255,255,255,0.05)',
          color: 'white',
          cursor: 'pointer'
        }}>
          <Download size={18} />
          <span>Export Logs</span>
        </button>
      </header>

      <GlassCard title="Audit Trail" subtitle="Recent system events">
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Filter logs by message, node, or type..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '10px 12px 10px 40px',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>
          <button style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
            <Filter size={18} />
            <span>Types</span>
          </button>
        </div>

        <div style={{ 
          background: 'rgba(0,0,0,0.2)', 
          borderRadius: '12px', 
          padding: '16px', 
          fontFamily: 'monospace',
          fontSize: '0.8125rem',
          color: '#94a3b8',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {logs.map((log) => (
            <div key={log.id} style={{ 
              display: 'grid', 
              gridTemplateColumns: '180px 100px 120px 1fr',
              gap: '16px',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.03)'
            }}>
              <span style={{ color: '#64748b' }}>[{log.timestamp}]</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.75rem' }}>
                <LogIcon type={log.type} />
                {log.type}
              </span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{log.node}</span>
              <span style={{ color: '#e2e8f0' }}>{log.message}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
