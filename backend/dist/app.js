"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const serverRoutes_1 = __importDefault(require("./routes/serverRoutes"));
const logRoutes_1 = __importDefault(require("./routes/logRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const featureFlagRoutes_1 = __importDefault(require("./routes/featureFlagRoutes"));
const app = (0, express_1.default)();
// Security & Parsing Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN, credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging
app.use((0, morgan_1.default)('dev'));
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', version: '1.0.0' });
});
// Mount Routes here
app.use('/auth', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/servers', serverRoutes_1.default);
app.use('/logs', logRoutes_1.default);
app.use('/reports', reportRoutes_1.default);
app.use('/features', featureFlagRoutes_1.default);
// Global Error Handler (must be strictly after routes)
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
