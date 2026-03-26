'use client';

import React, { useState } from 'react';
import { 
  Server, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  RotateCw,
  Square,
  ExternalLink
} from 'lucide-react';
import GlassCard from '@/components/admin/GlassCard';
import { motion } from 'framer-motion';

const ServerStatus = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'offline': return '#ef4444';
      case 'starting': return '#eab308';
      case 'maintenance': return '#6366f1';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        width: '8px', 
        height: '8px', 
        borderRadius: '50%', 
        background: getStatusColor(),
        boxShadow: `0 0 8px ${getStatusColor()}80` 
      }} />
      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white', textTransform: 'capitalize' }}>
        {status}
      </span>
    </div>
  );
};

export default function ServersPage() {
  const [servers] = useState([
    { id: 'SF-10293', name: 'US-East-Primary', type: 'Game Server', region: 'New York', status: 'online', cpu: '24%', ram: '8.2GB', ip: '192.168.1.100' },
    { id: 'SF-10294', name: 'EU-West-Main', type: 'Web Hosting', region: 'London', status: 'starting', cpu: '85%', ram: '12.4GB', ip: '192.168.1.102' },
    { id: 'SF-10295', name: 'Asia-SE-Node', type: 'Database Node', region: 'Singapore', status: 'online', cpu: '12%', ram: '4.1GB', ip: '192.168.1.105' },
    { id: 'SF-10296', name: 'BR-South-Backup', type: 'Storage', region: 'Sao Paulo', status: 'maintenance', cpu: '5%', ram: '1.2GB', ip: '192.168.1.108' },
    { id: 'SF-10297', name: 'AU-East-Game', type: 'Game Server', region: 'Sydney', status: 'offline', cpu: '0%', ram: '0GB', ip: '192.168.1.110' },
  ]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white' }}>Server Management</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Monitor and control your global server infrastructure.</p>
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
          <Plus size={18} />
          <span>Deploy New Server</span>
        </button>
      </header>

      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by name, ID, or IP..."
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
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>SERVER NAME</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>STATUS</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>CPU/RAM</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>IP ADDRESS</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <tr key={server.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                        <Server size={18} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{server.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{server.id} • {server.type}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}><ServerStatus status={server.status} /></td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)', width: '30px' }}>CPU</span>
                          <div style={{ flexGrow: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', width: '60px' }}>
                            <div style={{ height: '100%', background: 'var(--primary)', width: server.cpu, borderRadius: '2px' }} />
                          </div>
                          <span>{server.cpu}</span>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)', width: '30px' }}>RAM</span>
                          <div style={{ flexGrow: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', width: '60px' }}>
                            <div style={{ height: '100%', background: '#a5b4fc', width: '40%', borderRadius: '2px' }} />
                          </div>
                          <span>{server.ram}</span>
                       </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      {server.ip}
                      <ExternalLink size={12} />
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ padding: '6px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: '#22c55e', cursor: 'pointer' }} title="Restart"><RotateCw size={16} /></button>
                      <button style={{ padding: '6px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: '#ef4444', cursor: 'pointer' }} title="Stop"><Square size={16} /></button>
                      <button style={{ padding: '6px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', cursor: 'pointer' }} title="More"><MoreVertical size={16} /></button>
                    </div>
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
