import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { userRouter } from './features/users';
import { taskRouter } from './features/tasks';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Enable CORS
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.cors.allowedOrigins.includes('*') || env.cors.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Request logging
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// Parse JSON bodies with a limit of 10kb
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies with a limit of 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API routes
app.use(env.api.prefix, userRouter);
app.use(env.api.prefix, taskRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: env.nodeEnv,
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err);
  // Close server & exit process
  process.exit(1);
});

export default app;
