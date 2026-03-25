'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111214] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center text-2xl">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-[#5865F2] rounded-full flex items-center justify-center">
              <Lock className="text-white" size={24} />
            </div>
          </div>
          ServerForge Admin
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-500/20 text-red-400 rounded-md text-sm">{error}</div>}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                title="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1e1f22] border border-[#2b2d31] rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:border-[#5865F2]"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-400 uppercase mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                title="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1e1f22] border border-[#2b2d31] rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:border-[#5865F2]"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
