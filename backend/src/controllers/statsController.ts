import { Request, Response, NextFunction } from 'express';
import { Server } from '../models/Server';
import { User, IUser } from '../models/User';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user: IUser;
}

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const userId = req.user._id;

    // Fetch all servers owned by this user
    const servers = await Server.find({ ownerId: userId as any });
    
    const totalServers = servers.length;
    const activeServers = servers.filter(s => s.status === 'ONLINE').length;
    // @ts-ignore - votes might be added to schema later, if not present it defaults to 0 safely
    const totalVotes = servers.reduce((acc, curr) => acc + (curr.votes || 0), 0);

    // In a real system, we'd query an Analytics model here.
    const totalViews = 0; 

    res.status(200).json({
      success: true,
      data: {
        totalServers,
        activeServers,
        totalVotes,
        totalViews
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getGlobalStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalServers = await Server.countDocuments();
    const activeServers = await Server.countDocuments({ status: 'ONLINE' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalServers,
        activeServers
      }
    });
  } catch (err) {
    next(err);
  }
};
