'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Users, Server, Activity, Cpu } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalServers: 0, systemHealth: { cpu: 0, ram: 0 } });
  
  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(data => {
      if(!data.error) setStats(data);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back to ServerForge Admin Panel.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-100 mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-[#5865F2]/20 rounded-lg">
              <Users className="text-[#5865F2]" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Servers</p>
              <h3 className="text-3xl font-bold text-gray-100 mt-1">{stats.totalServers}</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Server className="text-green-500" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">CPU Usage</p>
              <h3 className="text-3xl font-bold text-gray-100 mt-1">{stats.systemHealth.cpu}%</h3>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Cpu className="text-yellow-500" size={24} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">RAM Usage</p>
              <h3 className="text-3xl font-bold text-gray-100 mt-1">{stats.systemHealth.ram}%</h3>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Activity className="text-red-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>System Status</CardHeader>
        <CardContent>
          <div className="p-4 bg-[#2b2d31] rounded-lg border border-[#1e1f22]">
            <p className="text-green-400 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              All systems are operational and running perfectly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
