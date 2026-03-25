'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Global Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Platform configuration and variables.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>General</CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Platform Name</label>
              <input type="text" defaultValue="ServerForge" className="w-full bg-[#1e1f22] border border-[#2b2d31] rounded-md px-4 py-2 text-gray-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Support Email</label>
              <input type="email" defaultValue="support@serverforge.net" className="w-full bg-[#1e1f22] border border-[#2b2d31] rounded-md px-4 py-2 text-gray-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Security</CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#1e1f22] border border-[#2b2d31] rounded-lg">
              <div>
                <p className="font-medium text-gray-200">Require 2FA</p>
                <p className="text-xs text-gray-400">Force all admins to use 2FA</p>
              </div>
              <div className="w-10 h-6 bg-green-500 rounded-full flex items-center p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full translate-x-4"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1e1f22] border border-[#2b2d31] rounded-lg">
              <div>
                <p className="font-medium text-gray-200">Auto-Ban System</p>
                <p className="text-xs text-gray-400">Enable AI Moderation triggers</p>
              </div>
              <div className="w-10 h-6 bg-gray-600 rounded-full flex items-center p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline">Discard Changes</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
