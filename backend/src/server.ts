import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import { json } from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { log } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { authenticateToken } from './middleware/auth';
import { userRouter } from './routes/users';
import { authRouter } from './routes/auth';
import { whatsappAccountRouter } from './routes/whatsappAccounts';
import { flowRouter } from './routes/flows';
import { paymentRouter } from './routes/payments';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', authenticateToken, userRouter);
app.use('/api/whatsapp-accounts', authenticateToken, whatsappAccountRouter);
app.use('/api/flows', authenticateToken, flowRouter);
app.use('/api/payments', authenticateToken, paymentRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Connect to database and start server
async function startServer() {
  try {
    await prisma.$connect();
    log.info('Connected to database successfully');

    app.listen(PORT, () => {
      log.info(`Server is running on port ${PORT}`);
      log.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    log.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  log.info('Shutting down gracefully...');
  await prisma.$disconnect();
  log.info('Database connection closed.');
  process.exit(0);
});

startServer();

export { app };