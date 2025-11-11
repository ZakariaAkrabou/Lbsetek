import http from 'http';
import createApp from './app';
import {connectDB} from './config/database';
import logger from './utils/logger';
import { config } from 'dotenv';
config(); 

const PORT = process.env.PORT || '5000';
const MONGO_URL = process.env.MONGO_URL || '';
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!MONGO_URL) {
  logger.error('MONGO_URL is not defined in environment. Exiting.');
  process.exit(1);
}

const app = createApp();
const server = http.createServer(app);

const start = async () => {
  try {
    await connectDB(MONGO_URL);
    server.listen(PORT, () => {
      logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Server startup failed:', err);
    process.exit(1);
  }
};

start();

const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    import('mongoose').then(mongoose => {
      mongoose.connection.close(false).then(() => {
        logger.info('MongoDB connection closed.');
        process.exit(0);
      });
    });
  });

  setTimeout(() => {
    logger.error('Forcing shutdown.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
