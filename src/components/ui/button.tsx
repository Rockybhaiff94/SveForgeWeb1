import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'destructive' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({ children, className = '', variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const baseStyle = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-[#5865F2] text-white hover:bg-[#4752C4]',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-[#2b2d31] bg-transparent hover:bg-[#2b2d31] text-gray-300',
    ghost: 'bg-transparent hover:bg-[#2b2d31] text-gray-300',
    glow: 'bg-[#5865F2] text-white shadow-[0_0_15px_rgba(88,101,242,0.5)] hover:shadow-[0_0_25px_rgba(88,101,242,0.7)]'
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-8 py-3 text-lg',
    icon: 'h-10 w-10 shrink-0'
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`} {...props}>
      {children}
    </button>
  );
}
