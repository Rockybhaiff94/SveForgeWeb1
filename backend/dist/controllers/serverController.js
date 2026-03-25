"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restartServer = exports.deleteServer = exports.updateServer = exports.createServer = exports.getServerById = exports.getServers = void 0;
const Server_1 = require("../models/Server");
const ServerRepository_1 = require("../repositories/ServerRepository");
const AuditService_1 = require("../services/AuditService");
const getServers = async (req, res, next) => {
    try {
        const filters = {};
        if (req.query.status)
            filters.status = req.query.status;
        const servers = await Server_1.Server.find(filters).populate('ownerId', 'username email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: servers.length, servers });
    }
    catch (err) {
        next(err);
    }
};
exports.getServers = getServers;
const getServerById = async (req, res, next) => {
    try {
        const server = await ServerRepository_1.ServerRepository.findById(req.params.id);
        if (!server) {
            res.status(404).json({ success: false, error: 'Server not found' });
            return;
        }
        res.status(200).json({ success: true, server });
    }
    catch (err) {
        next(err);
    }
};
exports.getServerById = getServerById;
const createServer = async (req, res, next) => {
    try {
        const { name, ownerId, ram, cpu } = req.body;
        const server = new Server_1.Server({ name, ownerId, ram, cpu });
        await server.save();
        await AuditService_1.AuditService.logAction({
            action: 'CREATE_SERVER',
            type: 'INFO',
            userId: req.user._id.toString(),
            actorRole: req.user.role,
            targetId: server._id.toString(),
            targetType: 'Server',
            ipAddress: req.ip,
            details: `Server '${name}' created`
        });
        res.status(201).json({ success: true, server });
    }
    catch (err) {
        next(err);
    }
};
exports.createServer = createServer;
const updateServer = async (req, res, next) => {
    try {
        const server = await Server_1.Server.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!server) {
            res.status(404).json({ success: false, error: 'Server not found' });
            return;
        }
        await ServerRepository_1.ServerRepository.clearCache(req.params.id);
        await AuditService_1.AuditService.logAction({
            action: 'UPDATE_SERVER',
            type: 'INFO',
            userId: req.user._id.toString(),
            actorRole: req.user.role,
            targetId: server._id.toString(),
            targetType: 'Server',
            ipAddress: req.ip,
        });
        res.status(200).json({ success: true, server });
    }
    catch (err) {
        next(err);
    }
};
exports.updateServer = updateServer;
const deleteServer = async (req, res, next) => {
    try {
        const server = await Server_1.Server.findById(req.params.id);
        if (!server) {
            res.status(404).json({ success: false, error: 'Server not found' });
            return;
        }
        await server.deleteOne();
        await ServerRepository_1.ServerRepository.clearCache(req.params.id);
        await AuditService_1.AuditService.logAction({
            action: 'DELETE_SERVER',
            type: 'WARNING',
            userId: req.user._id.toString(),
            actorRole: req.user.role,
            targetId: server._id.toString(),
            targetType: 'Server',
            ipAddress: req.ip,
            details: 'Server permanently deleted'
        });
        res.status(200).json({ success: true, message: 'Server deleted' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteServer = deleteServer;
const restartServer = async (req, res, next) => {
    try {
        const server = await Server_1.Server.findById(req.params.id);
        if (!server) {
            res.status(404).json({ success: false, error: 'Server not found' });
            return;
        }
        server.status = 'STARTING';
        await server.save();
        await ServerRepository_1.ServerRepository.clearCache(req.params.id);
        await AuditService_1.AuditService.logAction({
            action: 'RESTART_SERVER',
            type: 'ACTION',
            userId: req.user._id.toString(),
            actorRole: req.user.role,
            targetId: server._id.toString(),
            targetType: 'Server',
            ipAddress: req.ip,
        });
        res.status(200).json({ success: true, message: 'Server restart sequence initiated' });
    }
    catch (err) {
        next(err);
    }
};
exports.restartServer = restartServer;
