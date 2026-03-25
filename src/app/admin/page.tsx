import { Users, Server, Activity, ShieldAlert } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import ServerModel from '@/models/Server';

export const revalidate = 60; // Revalidate every minute

async function getStats() {
    await dbConnect();
    
    const [totalUsers, totalServers, activeServers] = await Promise.all([
        UserModel.countDocuments(),
        ServerModel.countDocuments(),
        ServerModel.countDocuments({ status: 'online' }),
    ]);
    
    return {
        totalUsers,
        totalServers,
        activeServers,
    };
}

export default async function AdminDashboardPage() {
    const stats = await getStats();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                <p className="text-sm text-zinc-400 mt-1">Real-time metrics and system status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card 
                    title="Total Users" 
                    value={stats.totalUsers.toString()} 
                    icon={<Users className="w-5 h-5 text-indigo-400" />} 
                    trend="+12%" 
                />
                <Card 
                    title="Total Servers" 
                    value={stats.totalServers.toString()} 
                    icon={<Server className="w-5 h-5 text-emerald-400" />} 
                    trend="+3" 
                />
                <Card 
                    title="Active Servers" 
                    value={stats.activeServers.toString()} 
                    icon={<Activity className="w-5 h-5 text-blue-400" />} 
                    subtitle={`${stats.totalServers > 0 ? Math.round((stats.activeServers / stats.totalServers) * 100) : 0}% of total`}
                />
                <Card 
                    title="System Status" 
                    value="Healthy" 
                    icon={<ShieldAlert className="w-5 h-5 text-emerald-500" />} 
                    valueColor="text-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-white mb-4">Latest Activity</h2>
                    <div className="space-y-4">
                        {/* Placeholder for real activity feed */}
                        <ActivityItem action="User Registered" time="5 mins ago" desc="New user joined the platform." />
                        <ActivityItem action="Server Added" time="15 mins ago" desc="Minecraft Server 'Survival Realm' added." />
                        <ActivityItem action="Admin Login" time="1 hour ago" desc="Successful admin login." />
                        <ActivityItem action="Server Offline" time="2 hours ago" desc="Server 'Creative Builds' went offline." />
                    </div>
                </div>
                
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800/50 transition-all text-sm font-medium text-zinc-300 hover:text-white">
                            Restart All Services
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800/50 transition-all text-sm font-medium text-zinc-300 hover:text-white">
                            Clear System Cache
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800/50 transition-all text-sm font-medium text-zinc-300 hover:text-white">
                            View Error Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({ title, value, icon, trend, subtitle, valueColor = "text-white" }: any) {
    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
            <div className="flex items-center justify-between z-10">
                <h3 className="text-zinc-400 font-medium text-sm">{title}</h3>
                <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800/50">
                    {icon}
                </div>
            </div>
            <div className="mt-4 z-10">
                <p className={`text-3xl font-bold tracking-tight ${valueColor}`}>{value}</p>
                {(trend || subtitle) && (
                    <p className="text-xs text-zinc-500 mt-2 font-medium">
                        {trend && <span className="text-emerald-400 mr-2">{trend}</span>}
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

function ActivityItem({ action, time, desc }: any) {
    return (
        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-zinc-900/50 transition-colors group">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 group-hover:scale-125 transition-transform"></div>
            <div>
                <p className="text-sm font-medium text-zinc-200">{action}</p>
                <p className="text-xs text-zinc-500 mt-1">{desc}</p>
            </div>
            <div className="ml-auto">
                <span className="text-xs text-zinc-600 font-medium">{time}</span>
            </div>
        </div>
    );
}
