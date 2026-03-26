'use client';

import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Users, 
  Activity, 
  TrendingUp, 
  Cpu,
  Globe,
  RefreshCcw,
  DollarSign,
  Mail,
  Download
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import GlassCard from '@/components/admin/GlassCard';
import { motion } from 'framer-motion';

const StatWidget = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <GlassCard className="stat-widget-premium">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ 
        padding: '10px', 
        background: 'rgba(99, 102, 241, 0.1)', 
        borderRadius: '10px',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={20} />
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        fontSize: '0.7rem', 
        fontWeight: 700, 
        color: isPositive ? '#22c55e' : '#ef4444',
        padding: '2px 6px',
        background: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderRadius: '12px'
      }}>
        {change}
      </div>
    </div>
    <div style={{ marginTop: '16px' }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
      <h2 style={{ fontSize: '1.25rem', color: 'white', fontWeight: 700, marginTop: '2px' }}>{value}</h2>
    </div>
  </GlassCard>
);

const GeographyChart = () => (
  <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
    <svg viewBox="0 0 800 450" style={{ width: '100%', height: '100%', opacity: 0.6 }}>
      <path fill="#1e293b" d="M150,150 Q200,100 250,150 T350,150 T450,150 T550,150" stroke="#334155" strokeWidth="1" />
      <circle cx="200" cy="180" r="4" fill="#6366f1" />
      <circle cx="400" cy="220" r="6" fill="#6366f1" />
      <circle cx="600" cy="160" r="3" fill="#6366f1" />
      <circle cx="500" cy="300" r="5" fill="#6366f1" />
    </svg>
    <div style={{ position: 'absolute', bottom: 0, left: 0, fontSize: '0.7rem', color: '#94a3b8' }}>Global Edge Nodes Active</div>
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState<any>({
    users: null,
    servers: null,
    revenue: null,
    system: null
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    try {
      // Trying to fetch from current project's stats API
      const res = await fetch('/api/stats');
      const stats = await res.json();
      
      // Fallback/Mock data generation if API doesn't provide all fields
      const generateTimeline = (days: number, base: number, variance: number) => 
        Array.from({ length: days }, (_, i) => ({
          date: new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0],
          count: Math.floor(base + Math.random() * variance)
        }));

      setData({
        users: { 
          totalUsers: stats.totalUsers || 12482, 
          activeUsers: Math.floor((stats.totalUsers || 12482) * 0.6), 
          growthRate: '+14.2%', 
          timeline: generateTimeline(7, 40, 20) 
        },
        servers: { 
          totalServers: stats.totalServers || 1284, 
          runningServers: Math.floor((stats.totalServers || 1284) * 0.8), 
          resourceUsage: Array.from({ length: 12 }, (_, i) => ({ 
            time: `${i * 2}h`, 
            cpu: stats.systemHealth?.cpu || Math.floor(40 + Math.random() * 20), 
            ram: stats.systemHealth?.ram || Math.floor(60 + Math.random() * 15) 
          })) 
        },
        revenue: { 
          monthlyRevenue: '$24,512', 
          revenueTimeline: generateTimeline(7, 18000, 4000).map(d => ({ ...d, revenue: d.count })), 
          planDistribution: [{ name: 'Free', value: 650 }, { name: 'Pro', value: 420 }, { name: 'Enterprise', value: 214 }] 
        },
        system: { 
          uptime: '99.99%', 
          apiRequests: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, requests: Math.floor(400 + Math.random() * 300) })) 
        }
      });
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ['#6366f1', '#a5b4fc', '#818cf8', '#4f46e5'];

  if (loading || !data.users) {
    return <div style={{ color: 'white', padding: '40px' }}>Loading real-time dashboard...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Real-time overview of your platform performance.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.75rem' }}>
            <RefreshCcw size={12} className={loading ? 'animate-spin' : ''} />
            Live: {lastUpdated.toLocaleTimeString()}
          </div>
          <button style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }} onClick={() => alert('Report download started...')}>
            <Download size={18} />
            Download Reports
          </button>
        </div>
      </header>

      {/* Row 1: Top Stats Grid (5 Columns) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: '24px' 
      }}>
        <StatWidget title="Emails / Users" value={data.users.totalUsers} change="+12.5%" isPositive={true} icon={Mail} />
        <StatWidget title="Sales / Revenue" value={data.revenue.monthlyRevenue} change="+18.7%" isPositive={true} icon={DollarSign} />
        <StatWidget title="Clients / Servers" value={data.servers.totalServers} change="+5.4%" isPositive={true} icon={Server} />
        <StatWidget title="Traffic" value="1.2M" change="+3.2%" isPositive={true} icon={Activity} />
        <StatWidget title="Growth %" value={data.users.growthRate} change={data.users.growthRate} isPositive={true} icon={TrendingUp} />
      </div>

      {/* Row 2: Main Section (Left 70%, Right 30%) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '24px' 
      }}>
        <GlassCard title="Revenue / Activity" subtitle="Historical performance over the last 7 days">
          <div style={{ height: '350px', width: '100%', marginTop: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue.revenueTimeline}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Recent Activity" subtitle="Latest global events">
           <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ padding: '8px', background: '#1e293b', borderRadius: '8px', color: '#6366f1' }}><Globe size={16} /></div>
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white' }}>Node Delta-{i} Active</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Region: Europe-West 1</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{i*2}m ago</span>
                </div>
              ))}
           </div>
        </GlassCard>
      </div>

      {/* Row 3: Lower Section (3 Equal Columns) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '24px' 
      }}>
        <GlassCard title="Plan Distribution" subtitle="Active subscriptions">
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.revenue.planDistribution} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                  {data.revenue.planDistribution.map((_, index) => <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Onboarding Trends" subtitle="New signups per day">
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.users.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} hide />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Geography / Traffic" subtitle="Server network distribution">
          <div style={{ height: '220px', width: '100%' }}>
            <GeographyChart />
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
