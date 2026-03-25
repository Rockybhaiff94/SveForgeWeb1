"use client";

import { useState, useEffect } from 'react';
import { FileText, Search, Filter, AlertTriangle, Info, Terminal, Shield } from 'lucide-react';

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    useEffect(() => {
        fetch('/api/admin/logs')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLogs(data.logs);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesType = filterType === 'ALL' || log.type === filterType;
        const matchesSearch = (log.action || '').toLowerCase().includes(search.toLowerCase()) || 
                              (log.description || '').toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Logs</h1>
                    <p className="text-sm text-zinc-400 mt-1">Audit trail and system events.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <select 
                        aria-label="Filter logs by type"
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 inline-flex items-center text-sm text-zinc-300 focus:outline-none focus:border-indigo-500"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="ALL">All Types</option>
                        <option value="AUTH">Authentication</option>
                        <option value="SERVER">Servers</option>
                        <option value="USER">Users</option>
                        <option value="SYSTEM">System</option>
                    </select>
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="divide-y divide-zinc-800/60 max-h-[70vh] overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-zinc-500">Loading logs...</div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500">No logs found matching your criteria.</div>
                    ) : (
                        filteredLogs.map((log) => (
                            <div key={log._id} className="p-4 flex items-start gap-4 hover:bg-zinc-900/40 transition-colors">
                                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                                    log.type === 'AUTH' ? 'bg-orange-500/10 text-orange-400' :
                                    log.type === 'SERVER' ? 'bg-emerald-500/10 text-emerald-400' :
                                    log.type === 'USER' ? 'bg-blue-500/10 text-blue-400' :
                                    'bg-zinc-800 text-zinc-400'
                                }`}>
                                    {log.type === 'AUTH' && <Shield className="w-4 h-4" />}
                                    {log.type === 'SERVER' && <Terminal className="w-4 h-4" />}
                                    {log.type === 'USER' && <Info className="w-4 h-4" />}
                                    {log.type === 'SYSTEM' && <AlertTriangle className="w-4 h-4" />}
                                    {!['AUTH', 'SERVER', 'USER', 'SYSTEM'].includes(log.type) && <FileText className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <p className="text-sm font-semibold text-zinc-200 truncate">{log.action}</p>
                                        <span className="text-xs text-zinc-500 whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-400">{log.description}</p>
                                    {log.userId && (
                                        <div className="mt-2 text-xs text-zinc-500 flex items-center gap-1.5">
                                            <span className="w-4 h-px bg-zinc-700"></span>
                                            User: {log.userId.username} ({log.userId.email})
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
