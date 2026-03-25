import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={\`bg-[#1e1f22]/80 backdrop-blur-md border border-[#2b2d31] rounded-xl p-6 shadow-xl \${className}\`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={\`font-semibold text-lg mb-4 text-gray-100 \${className}\`}>{children}</div>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={\`text-sm text-gray-300 \${className}\`}>{children}</div>;
}
