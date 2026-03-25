import { Request, Response, NextFunction } from 'express';
import { Server } from '../models/Server';
import { ServerRepository } from '../repositories/ServerRepository';
import { AuditService } from '../services/AuditService';

export const getServers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;

    const servers = await Server.find(filters).populate('ownerId', 'username email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: servers.length, servers });
  } catch (err) {
    next(err);
  }
};

export const getServerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const server = await ServerRepository.findById(req.params.id as string);
    if (!server) {
      res.status(404).json({ success: false, error: 'Server not found' });
      return;
    }
    res.status(200).json({ success: true, server });
  } catch (err) {
    next(err);
  }
};

export const createServer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, ownerId, ram, cpu } = req.body;
    const server = new Server({ name, ownerId, ram, cpu });
    await server.save();

    await AuditService.logAction({
      action: 'CREATE_SERVER',
      type: 'INFO',
      userId: req.user!._id.toString(),
      actorRole: req.user!.role,
      targetId: server._id.toString(),
      targetType: 'Server',
      ipAddress: req.ip,
      details: `Server '${name}' created`
    });

    res.status(201).json({ success: true, server });
  } catch (err) {
    next(err);
  }
};

export const updateServer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const server = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!server) {
      res.status(404).json({ success: false, error: 'Server not found' });
      return;
    }

    await ServerRepository.clearCache(req.params.id as string);

    await AuditService.logAction({
      action: 'UPDATE_SERVER',
      type: 'INFO',
      userId: req.user!._id.toString(),
      actorRole: req.user!.role,
      targetId: server._id.toString(),
      targetType: 'Server',
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, server });
  } catch (err) {
    next(err);
  }
};

export const deleteServer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const server = await Server.findById(req.params.id);
    if (!server) {
      res.status(404).json({ success: false, error: 'Server not found' });
      return;
    }

    await server.deleteOne();
    await ServerRepository.clearCache(req.params.id as string);

    await AuditService.logAction({
      action: 'DELETE_SERVER',
      type: 'WARNING',
      userId: req.user!._id.toString(),
      actorRole: req.user!.role,
      targetId: server._id.toString(),
      targetType: 'Server',
      ipAddress: req.ip,
      details: 'Server permanently deleted'
    });

    res.status(200).json({ success: true, message: 'Server deleted' });
  } catch (err) {
    next(err);
  }
};

export const restartServer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const server = await Server.findById(req.params.id);
    if (!server) {
      res.status(404).json({ success: false, error: 'Server not found' });
      return;
    }

    server.status = 'STARTING';
    await server.save();
    await ServerRepository.clearCache(req.params.id as string);

    await AuditService.logAction({
      action: 'RESTART_SERVER',
      type: 'ACTION',
      userId: req.user!._id.toString(),
      actorRole: req.user!.role,
      targetId: server._id.toString(),
      targetType: 'Server',
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, message: 'Server restart sequence initiated' });
  } catch (err) {
    next(err);
  }
};
