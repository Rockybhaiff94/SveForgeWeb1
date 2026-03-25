'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash, Edit2, ShieldAlert } from 'lucide-react';
import { UserModal } from '@/components/admin/UserModal';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if(data.users) setUsers(data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this user?')) {
      await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">User Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage platform users, roles, and permissions.</p>
        </div>
      </div>

      <Card>
        <CardHeader>All Users</CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="font-medium text-gray-200">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'OWNER' ? 'danger' : user.role === 'ADMIN' ? 'warning' : 'default'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'ACTIVE' ? 'success' : 'danger'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)} title="Inspect User">
                        <ShieldAlert size={16} className="text-blue-400 hover:text-blue-300" />
                      </Button>
                      <Button variant="ghost" size="sm"><Edit2 size={16} /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user._id)} className="text-red-400 hover:text-red-300" title="Delete">
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {selectedUser && (
        <UserModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          onRefresh={fetchUsers} 
        />
      )}
    </div>
  );
}
