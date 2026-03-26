'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  style?: React.CSSProperties;
}

const GlassCard = ({ children, title, subtitle, icon: Icon, className = '', style = {} }: GlassCardProps) => {
  return (
    <div className={`glass-card ${className}`} style={{
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }}>
      {(title || Icon) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            {title && <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white' }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{subtitle}</p>}
          </div>
          {Icon && (
            <div style={{ 
              padding: '10px', 
              background: 'rgba(99, 102, 241, 0.1)', 
              borderRadius: '12px',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={20} />
            </div>
          )}
        </div>
      )}
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
