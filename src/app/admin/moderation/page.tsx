'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ShieldMinus, UserCheck, AlertOctagon } from 'lucide-react';

export default function ModerationPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/moderation'); // Points to backend /reports
      const data = await res.json();
      if(data.reports) setReports(data.reports);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (reportId: string, actionName: string) => {
    let resolutionNotes = '';
    let status = '';

    if (actionName === 'CLAIM') status = 'INVESTIGATING';
    else if (actionName === 'RESOLVE') status = 'RESOLVED';
    else if (actionName === 'DISMISS') status = 'DISMISSED';
    
    if (status === 'RESOLVED' || status === 'DISMISSED') {
      const notes = prompt(`Enter resolution notes to ${status.toLowerCase()} this report:`);
      if (notes === null) return; 
      resolutionNotes = notes;
    } else if (status === 'INVESTIGATING') {
      if (!confirm('Are you sure you want to claim this report?')) return;
    }

    try {
      const res = await fetch(`/api/moderation/${reportId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolutionNotes })
      });
      if (res.ok) fetchReports();
      else alert('Action failed');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <AlertOctagon className="text-red-400" /> Moderation Queue
          </h1>
          <p className="text-sm text-gray-400 mt-1">Review, claim, and resolve user and system reports.</p>
        </div>
      </div>

      <Card>
        <CardHeader>Active Reports</CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading reports...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Target</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>
                      <div className="font-medium text-gray-200">{report.targetType}</div>
                      <div className="text-xs text-gray-500 font-mono">{report.targetId}</div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {report.reporterId?.email || 'System / Anonymous'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-300">
                      <span title={report.details || report.reason}>{report.reason}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={report.moderationScore > 50 ? 'danger' : 'warning'}>
                        {report.moderationScore}% {report.aiFlagged && '(AI)'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        report.status === 'RESOLVED' ? 'success' : 
                        report.status === 'DISMISSED' ? 'default' : 
                        report.status === 'INVESTIGATING' ? 'warning' : 'danger'
                      }>
                        {report.status}
                      </Badge>
                      {report.assignedTo && (
                        <div className="text-xs text-blue-400 mt-1">
                          ↳ {report.assignedTo.name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {report.status === 'PENDING' && (
                        <Button variant="outline" size="sm" onClick={() => handleAction(report._id, 'CLAIM')} className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20">
                          <UserCheck size={16} className="mr-1" /> Claim
                        </Button>
                      )}
                      
                      {report.status === 'INVESTIGATING' && (
                        <>
                          <Button variant="destructive" size="sm" onClick={() => handleAction(report._id, 'RESOLVE')}>
                            <ShieldCheck size={16} className="mr-1" /> Resolve
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleAction(report._id, 'DISMISS')} className="text-gray-400 hover:text-gray-300">
                            <ShieldMinus size={16} />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {reports.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">Queue is empty. Good job!</TableCell>
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
