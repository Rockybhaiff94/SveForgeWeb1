import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/errorMiddleware';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import serverRoutes from './routes/serverRoutes';
import logRoutes from './routes/logRoutes';
import reportRoutes from './routes/reportRoutes';
import featureFlagRoutes from './routes/featureFlagRoutes';

const app = express();

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', version: '1.0.0' });
});

// Mount Routes here
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/servers', serverRoutes);
app.use('/logs', logRoutes);
app.use('/reports', reportRoutes);
app.use('/features', featureFlagRoutes);

// Global Error Handler (must be strictly after routes)
app.use(errorHandler);

export default app;
