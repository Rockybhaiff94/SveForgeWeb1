import React from 'react';

export function Badge({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' }) {
  const variants = {
    default: 'bg-[#2b2d31] text-gray-300',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400'
  };

  return (
    <span className={\`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium \${variants[variant]}\`}>
      {children}
    </span>
  );
}
