'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

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
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (typeFilter !== 'ALL' && log.type !== typeFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(term) ||
        (log.ipAddress && log.ipAddress.includes(term)) ||
        (log.details && log.details.toLowerCase().includes(term)) ||
        (log.userId?.email && log.userId.email.toLowerCase().includes(term))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Global Audit Logs</h1>
          <p className="text-sm text-gray-400 mt-1">Enterprise audit trail with comprehensive target and IP tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search IP, User, Action..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#1e1f22] border border-[#2b2d31] rounded-lg text-sm text-gray-200 focus:outline-none focus:border-blue-500 w-64"
              title="Search Logs"
            />
          </div>
          <select 
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#1e1f22] border border-[#2b2d31] rounded-lg text-sm text-gray-200 focus:outline-none"
            title="Filter by Type"
            aria-label="Filter logs by type"
          >
            <option value="ALL">All Events</option>
            <option value="ACTION">Actions</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warnings</option>
            <option value="ERROR">Errors</option>
          </select>
          <Button variant="outline" onClick={fetchLogs} disabled={loading} title="Refresh logs">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>System Activity</CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Actor / IP</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredLogs.map(log => (
                <TableRow key={log._id}>
                  <TableCell className="text-xs text-gray-400 w-32 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <Badge variant={
                        log.type === 'ERROR' ? 'danger' : 
                        log.type === 'WARNING' ? 'warning' : 'default'
                      }>
                        {log.type}
                      </Badge>
                      <span className="text-xs font-semibold text-gray-300">{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-blue-400">
                      {log.userId?.name || 'System'}
                      {log.actorRole && <span className="text-gray-500 text-xs ml-1">({log.actorRole})</span>}
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-1">{log.ipAddress || 'Internal'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-[#2b2d31] text-gray-300 bg-[#2b2d31]/30">
                      {log.targetType || 'System'}
                    </Badge>
                    {log.targetId && <div className="text-xs text-gray-500 font-mono mt-1 truncate max-w-[120px]" title={log.targetId}>{log.targetId}</div>}
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm max-w-sm truncate">
                    <span title={log.details || ''}>{log.details || '-'}</span>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    {logs.length > 0 ? 'No logs match your filters.' : 'No audit logs exist yet.'}
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
