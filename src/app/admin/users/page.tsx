"use client";

import { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, MoreVertical, Edit, Shield, Ban } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUsers(data.users);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredUsers = users.filter(user => 
        (user.username || '').toLowerCase().includes(search.toLowerCase()) || 
        (user.email || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-sm text-zinc-400 mt-1">Manage user roles, bans, and details.</p>
                </div>
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 font-semibold border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Discord ID</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-zinc-900/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-zinc-800" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                                                        {user.username?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-zinc-200">{user.username}</p>
                                                    <p className="text-xs text-zinc-500">{user.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{user.discordId || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                user.role === 'OWNER' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                                user.role === 'ADMIN' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                user.role === 'DEV' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                user.role === 'MOD' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                            }`}>
                                                {user.role || 'USER'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-md transition-colors" title="Edit Role">
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors" title="Ban User">
                                                    <Ban className="w-4 h-4" />
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
