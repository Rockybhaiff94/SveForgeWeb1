import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Server } from '../models/Server';
import { AuditLog } from '../models/AuditLog';

export const getUsersAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = Math.floor(totalUsers * 0.85); // Simulated active users for demo
    
    // Aggregate new signups for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const timeline = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      timeline.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 50) + 10
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        growthRate: '+12.5%',
        timeline: timeline.reverse()
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getServersAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalServers = await Server.countDocuments();
    const runningServers = await Server.countDocuments({ status: 'ONLINE' });
    
    const resourceUsage = Array.from({ length: 12 }, (_, i) => ({
      time: `${i * 2}h`,
      cpu: Math.floor(Math.random() * 40) + 30,
      ram: Math.floor(Math.random() * 30) + 50
    }));

    res.status(200).json({
      success: true,
      data: {
        totalServers,
        runningServers,
        stoppedServers: totalServers - runningServers,
        resourceUsage
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getRevenueAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const revenueTimeline = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000) + 15000
      };
    }).reverse();

    const planDistribution = [
      { name: 'Free', value: 65 },
      { name: 'Pro', value: 25 },
      { name: 'Enterprise', value: 10 }
    ];

    res.status(200).json({
      success: true,
      data: {
        monthlyRevenue: '$24,512',
        revenueTimeline,
        planDistribution
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getSystemAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const apiRequests = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      requests: Math.floor(Math.random() * 200) + 500
    }));

    res.status(200).json({
      success: true,
      data: {
        uptime: '99.98%',
        errorRate: '0.02%',
        apiRequests
      }
    });
  } catch (err) {
    next(err);
  }
};
