import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ShieldAlert, PowerOff, Shield, AlertTriangle } from 'lucide-react';

export function UserModal({ user, onClose, onRefresh }: { user: any, onClose: () => void, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [roleSelect, setRoleSelect] = useState(user.role);

  const handleAction = async (action: string, extraData: any = {}) => {
    if (!confirm(`Are you sure you want to ${action.replace('_', ' ')} this user?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extraData })
      });
      if (res.ok) {
        onRefresh();
        onClose();
      } else {
        const error = await res.json();
        alert('Action failed: ' + error.error);
      }
    } catch (err: any) {
      alert('Action failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e1f22] border border-[#2b2d31] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#2b2d31]">
          <div>
            <h2 className="text-xl font-bold text-gray-100">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors" title="Close" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2b2d31]/50 p-4 rounded-lg">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</span>
              <div className="mt-1"><Badge>{user.role}</Badge></div>
            </div>
            <div className="bg-[#2b2d31]/50 p-4 rounded-lg">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
              <div className="mt-1"><Badge variant={user.status === 'ACTIVE' ? 'success' : 'danger'}>{user.status}</Badge></div>
            </div>
            <div className="bg-[#2b2d31]/50 p-4 rounded-lg">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</span>
              <div className="mt-1 text-sm text-gray-200">{new Date(user.createdAt).toLocaleString()}</div>
            </div>
            <div className="bg-[#2b2d31]/50 p-4 rounded-lg">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Token Version</span>
              <div className="mt-1 text-sm text-gray-200">v{user.tokenVersion || 0}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 border-b border-[#2b2d31] pb-2">Known IP Addresses</h3>
            <div className="flex flex-wrap gap-2">
              {user.ips && user.ips.length > 0 ? user.ips.map((ip: string) => (
                <span key={ip} className="px-2 py-1 bg-[#2b2d31] rounded text-xs text-gray-400 font-mono">{ip}</span>
              )) : <span className="text-xs text-gray-500">No IPs logged yet.</span>}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-red-400 mb-3 border-b border-red-500/20 pb-2 flex items-center gap-2">
              <ShieldAlert size={16} /> Danger Zone
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-200">Force Logout</div>
                  <div className="text-xs text-gray-400">Invalidates all active sessions immediately.</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAction('FORCE_LOGOUT')} disabled={loading} className="text-red-400 border-red-500/30 hover:bg-red-500/20">
                  <PowerOff size={16} className="mr-2" /> Kill Sessions
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-200">Account Suspension</div>
                  <div className="text-xs text-gray-400">Temporarily or permanently disable access.</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleAction('SUSPEND')} disabled={loading || user.status === 'SUSPENDED'}>Suspend</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleAction('BAN')} disabled={loading || user.status === 'BANNED'}>Ban</Button>
                  <Button size="sm" variant="ghost" className="text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-400" onClick={() => handleAction('SHADOW_BAN')} disabled={loading || user.status === 'SHADOW_BANNED'} title="Shadow Ban">
                    <AlertTriangle size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#2b2d31]/50 border border-[#2b2d31] rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-200">Change Role</div>
                  <div className="text-xs text-gray-400">Elevate or demote user permissions.</div>
                </div>
                <div className="flex gap-2 items-center">
                  <select 
                    value={roleSelect} 
                    onChange={e => setRoleSelect(e.target.value)}
                    className="bg-[#1e1f22] border border-[#2b2d31] text-sm text-gray-300 rounded px-2 py-1 outline-none"
                    aria-label="Select Role"
                    title="Select Role"
                  >
                    <option value="USER">USER</option>
                    <option value="MOD">MOD</option>
                    <option value="DEV">DEV</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="OWNER">OWNER</option>
                  </select>
                  <Button size="sm" variant="primary" onClick={() => handleAction('CHANGE_ROLE', { newRole: roleSelect })} disabled={loading || roleSelect === user.role}>
                    <Shield size={16} className="mr-2" /> Update
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
