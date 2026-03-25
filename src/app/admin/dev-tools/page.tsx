'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Send, Zap, RefreshCw } from 'lucide-react';

export default function DevToolsPage() {
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiUrl, setApiUrl] = useState('/api/admin/metrics/live');
  const [apiPayload, setApiPayload] = useState('{}');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [overrideRateLimit, setOverrideRateLimit] = useState(false);

  const handleTestAPI = async () => {
    setLoading(true);
    setApiResponse(null);
    try {
      const options: RequestInit = { method: apiMethod };
      if (apiMethod !== 'GET' && apiMethod !== 'HEAD') {
        options.body = apiPayload;
        options.headers = { 'Content-Type': 'application/json' };
      }
      const res = await fetch(apiUrl, options);
      const data = await res.json().catch(() => ({ _error: 'Invalid JSON response' }));
      setApiResponse({ status: res.status, ok: res.ok, data });
    } catch (err: any) {
      setApiResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
          <Terminal className="text-purple-400" /> Dev Tools & Platform Overrides
        </h1>
        <p className="text-sm text-gray-400 mt-1">Advanced diagnostic and control panel. Restricted to DEV and OWNER roles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core System Overrides */}
        <div className="space-y-6">
          <Card className="border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
            <CardHeader className="text-purple-400 border-b border-purple-500/20">Feature Flags & Overrides</CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-3 bg-[#1e1f22] border border-[#2b2d31] rounded-lg">
                <div>
                  <p className="font-medium text-gray-200">Global Rate Limit Bypass</p>
                  <p className="text-xs text-gray-400">Ignore IP-based rate limiting for your session.</p>
                </div>
                <div onClick={() => setOverrideRateLimit(!overrideRateLimit)} className={`w-10 h-6 ${overrideRateLimit ? 'bg-purple-500' : 'bg-gray-600'} rounded-full flex items-center p-1 cursor-pointer transition-colors`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${overrideRateLimit ? 'translate-x-4' : ''}`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1e1f22] border border-[#2b2d31] rounded-lg opacity-50 cursor-not-allowed">
                <div>
                  <p className="font-medium text-gray-200">Maintenance Mode</p>
                  <p className="text-xs text-gray-400">Lock out all non-admin users instantly.</p>
                </div>
                <div className="w-10 h-6 bg-gray-600 rounded-full flex items-center p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-blue-400 border-b border-blue-500/20 flex flex-row items-center justify-between">
              Database Direct Connect (Read-Only)
            </CardHeader>
            <CardContent className="p-4 space-y-3 font-mono text-sm text-gray-300">
              <p className="text-xs text-gray-500 mb-2">// Sample query runner simulation</p>
              <div className="bg-[#1e1f22] p-3 rounded border border-[#2b2d31]">
                <span className="text-purple-400">db</span>.<span className="text-blue-400">users</span>.<span className="text-yellow-400">find</span>(&#123; role: <span className="text-green-400">"ADMIN"</span> &#125;)
              </div>
              <Button size="sm" variant="outline" className="w-full text-blue-400 border-blue-500/30 hover:bg-blue-500/10">Execute Query</Button>
            </CardContent>
          </Card>
        </div>

        {/* API Request Tester */}
        <Card className="flex flex-col h-full">
          <CardHeader className="text-green-400 border-b border-green-500/20 flex flex-row items-center gap-2">
            <Zap size={18} /> API Request Tester
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-4 space-y-4">
            <div className="flex gap-2">
              <select 
                value={apiMethod} 
                onChange={e => setApiMethod(e.target.value)}
                className="bg-[#1e1f22] border border-[#2b2d31] text-sm text-gray-200 rounded px-3 py-2 outline-none w-24"
                title="HTTP Method"
                aria-label="HTTP Method"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <input 
                type="text" 
                value={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
                className="flex-1 bg-[#1e1f22] border border-[#2b2d31] rounded p-2 text-sm text-gray-200 focus:outline-none focus:border-green-500/50"
                placeholder="/api/..."
                title="API URL"
              />
            </div>
            
            {apiMethod !== 'GET' && (
              <textarea 
                value={apiPayload}
                onChange={e => setApiPayload(e.target.value)}
                className="w-full h-32 bg-[#1e1f22] border border-[#2b2d31] rounded p-3 text-sm text-gray-300 font-mono focus:outline-none focus:border-green-500/50 resize-none"
                placeholder="{}"
                title="JSON Payload"
              />
            )}
            
            <Button variant="primary" onClick={handleTestAPI} disabled={loading} className="w-full bg-green-600 hover:bg-green-500 text-white border-none">
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <><Send size={16} className="mr-2" /> Send Request</>}
            </Button>

            <div className="flex-1 min-h-[200px] mt-4 bg-[#111214] border border-[#1e1f22] rounded-lg p-3 font-mono text-xs overflow-auto relative">
              <span className="absolute top-2 right-3 text-[#2b2d31] font-bold">RESPONSE</span>
              {apiResponse ? (
                <pre className={apiResponse.ok === false ? 'text-red-400' : 'text-green-400'}>
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-600 italic mt-8 text-center">No request sent yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
