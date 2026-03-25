'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Terminal, Database, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DevToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Developer Tools</h1>
        <p className="text-sm text-gray-400 mt-1">API instrumentation, database tools, and API key management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-500/30">
          <CardHeader className="flex flex-row items-center gap-2 text-blue-400 pb-2">
            <Database size={20} />
            DB Console
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">Run raw Mongoose aggregations safely directly from UI.</p>
            <Button variant="outline" className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10">Open Query Runner</Button>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30">
          <CardHeader className="flex flex-row items-center gap-2 text-purple-400 pb-2">
            <Terminal size={20} />
            Request Inspector
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">Live stream of incoming Edge Request objects and middleware outputs.</p>
            <Button variant="outline" className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10">Start Tracking Session</Button>
          </CardContent>
        </Card>

        <Card className="border-red-500/30">
          <CardHeader className="flex flex-row items-center gap-2 text-red-400 pb-2">
            <ShieldAlert size={20} />
            Rate Limit Manager
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">Monitor and flush API rate limit tracking via Redis.</p>
            <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">View Rate Limit Table</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>API Keys</CardHeader>
        <CardContent className="p-0">
          <div className="p-6 border-b border-[#2b2d31]">
            <p className="text-sm text-gray-400 mb-4">Manage REST API keys used for ServerForge worker integrations.</p>
            <Button variant="primary" size="sm">Generate New Key</Button>
          </div>
          <div className="p-6 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-200 font-mono">sf_live_**********************</span>
              <span className="text-xs text-gray-500">Created 2 days ago</span>
            </div>
            <Button variant="ghost" className="text-red-400 hover:text-red-300">Revoke</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
