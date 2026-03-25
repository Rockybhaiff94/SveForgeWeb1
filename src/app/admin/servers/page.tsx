"use client";

import { useState, useEffect } from 'react';
import { Server as ServerIcon, Search, Play, Square, RefreshCw, Edit, Trash2 } from 'lucide-react';

export default function ServersPage() {
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/admin/servers')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setServers(data.servers);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredServers = servers.filter(server => 
        (server.serverName || '').toLowerCase().includes(search.toLowerCase()) || 
        (server.ip || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Server Management</h1>
                    <p className="text-sm text-zinc-400 mt-1">Monitor and control listed servers.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input 
                            type="text" 
                            placeholder="Search servers..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 font-semibold border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">Server Name</th>
                                <th className="px-6 py-4">Address</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Players</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Loading servers...</td>
                                </tr>
                            ) : filteredServers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No servers found.</td>
                                </tr>
                            ) : (
                                filteredServers.map((server) => (
                                    <tr key={server._id} className="hover:bg-zinc-900/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-zinc-200">
                                            {server.serverName}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-zinc-300">
                                            {server.ip}:{server.port}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium flex-inline items-center gap-1 w-fit ${
                                                server.status === 'online' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                                                'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1 ${server.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                {server.status ? server.status.toUpperCase() : 'OFFLINE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {server.players} / {server.players_max}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-md transition-colors" title="Start">
                                                    <Play className="w-4 h-4 fill-current" />
                                                </button>
                                                <button className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors" title="Stop">
                                                    <Square className="w-4 h-4 fill-current" />
                                                </button>
                                                <button className="p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors" title="Restart">
                                                    <RefreshCw className="w-4 h-4" />
                                                </button>
                                                <div className="w-px h-6 bg-zinc-800 mx-1"></div>
                                                <button className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-md transition-colors" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
