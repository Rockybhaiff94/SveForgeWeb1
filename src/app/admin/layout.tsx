import React from 'react';
import { getSessionUser } from '@/lib/auth-util';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import '@/styles/admin-theme.css';
import '@/styles/glassmorphism.css';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <AdminLayoutClient user={user}>
      {children}
    </AdminLayoutClient>
  );
}
