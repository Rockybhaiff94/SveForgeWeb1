import { Shield, Check, X } from 'lucide-react';

export default function PermissionsPage() {
    const roles = [
        { name: 'OWNER', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
        { name: 'ADMIN', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
        { name: 'DEV', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
        { name: 'MOD', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    ];

    const permissions = [
        { id: 'view_dashboard', label: 'View Dashboard & Stats', owner: true, admin: true, dev: true, mod: true },
        { id: 'manage_users', label: 'Manage Users (Ban/Role)', owner: true, admin: true, dev: false, mod: false },
        { id: 'manage_servers', label: 'Manage Servers (Start/Stop)', owner: true, admin: true, dev: true, mod: false },
        { id: 'view_logs', label: 'View System Logs', owner: true, admin: true, dev: true, mod: false },
        { id: 'manage_settings', label: 'Edit Global Settings', owner: true, admin: false, dev: false, mod: false },
        { id: 'moderate_content', label: 'Moderate Content', owner: true, admin: true, dev: false, mod: true },
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Role Definitions</h1>
                <p className="text-sm text-zinc-400 mt-1">Review access levels across the platform.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 font-semibold border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">Permission</th>
                                {roles.map(role => (
                                    <th key={role.name} className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold border ${role.color} ${role.bg}`}>
                                            {role.name}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {permissions.map((perm) => (
                                <tr key={perm.id} className="hover:bg-zinc-900/40 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-zinc-200">
                                        {perm.label}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {perm.owner ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-zinc-600 mx-auto" />}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {perm.admin ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-zinc-600 mx-auto" />}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {perm.dev ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-zinc-600 mx-auto" />}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {perm.mod ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-zinc-600 mx-auto" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 text-sm text-blue-400">
                <Shield className="w-5 h-5 shrink-0" />
                <p>Role permissions are strictly enforced via the edge-compatible `verifyJwtEdge` middleware function across all `/admin/*` routes.</p>
            </div>
        </div>
    );
}
