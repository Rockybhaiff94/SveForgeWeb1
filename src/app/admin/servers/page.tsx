'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Power, PowerOff, Trash, Plus } from 'lucide-react';

export default function ServersPage() {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    try {
      const res = await fetch('/api/servers');
      const data = await res.json();
      if(data.servers) setServers(data.servers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    if(confirm(\`Are you sure you want to \${newStatus === 'ONLINE' ? 'start' : 'stop'} this server?\`)) {
      await fetch('/api/servers', { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      fetchServers();
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this server?')) {
      await fetch(\`/api/servers?id=\${id}\`, { method: 'DELETE' });
      fetchServers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Server Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage game servers, resources, and statuses.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={18} /> Add Server
        </Button>
      </div>

      <Card>
        <CardHeader>All Servers</CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading servers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Server Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {servers.map(server => (
                  <TableRow key={server._id}>
                    <TableCell className="font-medium text-gray-200">{server.name}</TableCell>
                    <TableCell className="text-gray-400">{server.ownerId?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant={server.status === 'ONLINE' ? 'success' : 'danger'}>
                        {server.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-400">{server.ram}MB RAM</div>
                      <div className="text-xs text-gray-400">{server.cpu} Cores</div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={server.status === 'ONLINE' ? 'text-yellow-500 hover:text-yellow-400' : 'text-green-500 hover:text-green-400'}
                        onClick={() => handleStatusChange(server._id, server.status)}
                      >
                        {server.status === 'ONLINE' ? <PowerOff size={16} /> : <Power size={16} />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(server._id)} className="text-red-400 hover:text-red-300">
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {servers.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">No servers found.</TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
