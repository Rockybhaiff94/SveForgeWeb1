'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      if(data.logs) setLogs(data.logs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Simple polling for real-time logs fallback as requested
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">System Logs</h1>
          <p className="text-sm text-gray-400 mt-1">Real-time audit logs for all actions.</p>
        </div>
        <Button variant="outline" onClick={fetchLogs} disabled={loading} className="flex items-center gap-2">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>Recent Activity (Live)</CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User / Context</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {logs.map(log => (
                <TableRow key={log._id}>
                  <TableCell className="text-xs text-gray-400 w-32 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      log.type === 'ERROR' ? 'danger' : 
                      log.type === 'WARNING' ? 'warning' : 'default'
                    }>
                      {log.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-300">{log.action}</TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {log.userId?.name || 'System'} {log.serverId ? \`• \${log.serverId.name}\` : ''}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{log.details || '-'}</TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">No recent logs.</TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
