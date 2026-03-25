'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Role & Permissions</h1>
        <p className="text-sm text-gray-400 mt-1">Manage RBAC hierarchy and capabilities.</p>
      </div>

      <Card>
        <CardHeader>Role Hierarchy</CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-[#1e1f22] border border-red-500/20 rounded-lg">
            <h3 className="text-red-400 font-bold mb-1">OWNER (Level 4)</h3>
            <p className="text-xs text-gray-400">Total system control. Bypass all restrictions.</p>
          </div>
          <div className="p-4 bg-[#1e1f22] border border-yellow-500/20 rounded-lg">
            <h3 className="text-yellow-400 font-bold mb-1">ADMIN (Level 3)</h3>
            <p className="text-xs text-gray-400">Manage users, view logs, edit global settings.</p>
          </div>
          <div className="p-4 bg-[#1e1f22] border border-blue-500/20 rounded-lg">
            <h3 className="text-blue-400 font-bold mb-1">DEV (Level 2)</h3>
            <p className="text-xs text-gray-400">Access Dev-Tools, View API telemetry, Manage integrations.</p>
          </div>
          <div className="p-4 bg-[#1e1f22] border border-green-500/20 rounded-lg">
            <h3 className="text-green-400 font-bold mb-1">MOD (Level 1)</h3>
            <p className="text-xs text-gray-400">Can view user lists, perform basic moderation tasks on servers.</p>
          </div>
          <div className="p-4 bg-[#1e1f22] border border-[#2b2d31] rounded-lg">
            <h3 className="text-gray-300 font-bold mb-1">USER (Level 0)</h3>
            <p className="text-xs text-gray-400">Standard platform access.</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button>Save Configuration</Button>
      </div>
    </div>
  );
}
