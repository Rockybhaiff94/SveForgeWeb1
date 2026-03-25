"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const mongoose_1 = require("mongoose");
const ServerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['ONLINE', 'OFFLINE', 'STARTING', 'STOPPING', 'MAINTENANCE'], default: 'OFFLINE' },
    ram: { type: Number, default: 1024 },
    cpu: { type: Number, default: 1 },
    moderators: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
exports.Server = (0, mongoose_1.model)('Server', ServerSchema);
