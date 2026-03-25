import React from 'react';

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[#2b2d31]">
      <table className="w-full text-left text-sm text-gray-300 bg-[#1e1f22]">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-[#2b2d31] text-xs uppercase text-gray-400">{children}</thead>;
}

export function TableRow({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <tr className={\`border-b border-[#2b2d31] last:border-0 hover:bg-[#2b2d31]/50 \${className}\`}>{children}</tr>;
}

export function TableHead({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <th className={\`px-6 py-3 font-semibold \${className}\`}>{children}</th>;
}

export function TableCell({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <td className={\`px-6 py-4 \${className}\`}>{children}</td>;
}
