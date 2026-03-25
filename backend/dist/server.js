"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const db_1 = require("./config/db");
const socket_1 = require("./config/socket");
const auditWorker_1 = require("./workers/auditWorker");
const server = http_1.default.createServer(app_1.default);
const startServer = async () => {
    try {
        // 1. Connect MongoDB
        await (0, db_1.connectDB)();
        // 2. Initialize WebSockets attached to the raw HTTP server
        (0, socket_1.initSocket)(server);
        // 3. Mount Background Queue Workers
        (0, auditWorker_1.startAuditWorker)();
        // 4. Start listening
        server.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`🚀 ServerForge Backend running on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
