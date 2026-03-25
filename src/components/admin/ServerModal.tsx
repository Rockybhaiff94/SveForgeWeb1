import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Server as ServerIcon, Settings, Play, Square, Activity } from 'lucide-react';

export function ServerModal({ server, onClose, onRefresh }: { server: any, onClose: () => void, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [ramLimit, setRamLimit] = useState(server.ram || 1024);
  const [cpuLimit, setCpuLimit] = useState(server.cpu || 1);

  const handleAction = async (action: string, extraData: any = {}) => {
    if (!confirm(`Are you sure you want to ${action.replace('_', ' ')} this server?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/servers/${server._id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extraData })
      });
      if (res.ok) {
        onRefresh();
        if (action !== 'UPDATE_LIMITS') onClose();
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
            <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <ServerIcon size={20} className="text-blue-400" /> {server.name}
            </h2>
            <p className="text-sm text-gray-400">ID: {server._id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors" title="Close" aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#2b2d31]/50 p-4 rounded-lg">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
              <div className="mt-1">
                <Badge variant={server.status === 'ONLINE' ? 'success' : server.status === 'OFFLINE' ? 'danger' : 'warning'}>
                  {server.status}
                </Badge>
              </div>
            </div>
            <div className="bg-[#2b2d31]/50 p-4 rounded-lg">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Region</span>
              <div className="mt-1 text-sm text-gray-200">{server.region || 'US-East'}</div>
            </div>
            <div className="bg-[#2b2d31]/50 p-4 rounded-lg">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</span>
              <div className="mt-1 text-sm text-gray-200">{new Date(server.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 border-b border-[#2b2d31] pb-2 flex items-center gap-2">
              <Settings size={16} /> Resource Allocation
            </h3>
            <div className="bg-[#2b2d31]/30 p-4 border border-[#2b2d31] rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">RAM Limit (MB)</label>
                  <input 
                    type="number" 
                    value={ramLimit} 
                    onChange={e => setRamLimit(Number(e.target.value))}
                    className="w-full bg-[#1e1f22] border border-[#2b2d31] rounded p-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                    title="RAM Limit"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">CPU Cores</label>
                  <input 
                    type="number" 
                    value={cpuLimit} 
                    onChange={e => setCpuLimit(Number(e.target.value))}
                    className="w-full bg-[#1e1f22] border border-[#2b2d31] rounded p-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                    title="CPU Cores"
                  />
                </div>
              </div>
              <Button size="sm" variant="primary" onClick={() => handleAction('UPDATE_LIMITS', { newLimits: { ram: ramLimit, cpu: cpuLimit } })} disabled={loading || (ramLimit === server.ram && cpuLimit === server.cpu)}>
                Save Changes
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-blue-400 mb-3 border-b border-blue-500/20 pb-2 flex items-center gap-2">
              <Activity size={16} /> Platform Actions
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-200">Simulate Deployment</div>
                  <div className="text-xs text-gray-400">Forces an environment pull and restart cycle.</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAction('SIMULATE_DEPLOY')} disabled={loading || server.status !== 'ONLINE'} className="text-blue-400 border-blue-500/30 hover:bg-blue-500/20">
                  <Play size={16} className="mr-2" /> Deploy
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-200">Restart Server</div>
                  <div className="text-xs text-gray-400">Gracefully stop and start the process.</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAction('RESTART')} disabled={loading || server.status !== 'ONLINE'} className="text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20">
                  Restart
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-200">Stop Server</div>
                  <div className="text-xs text-gray-400">Immediately halt all server processes.</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAction('STOP')} disabled={loading || server.status === 'OFFLINE'} className="text-red-400 border-red-500/30 hover:bg-red-500/20">
                  <Square size={16} className="mr-2" /> Stop
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
