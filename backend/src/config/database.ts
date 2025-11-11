import mongoose from 'mongoose';
import logger from '../utils/logger';

const MONGO_URL = process.env.MONGO_URL || '';

export async function connectDB(MONGO_URL: string): Promise<void> {
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not defined in environment variables');
  }

  try {
    await mongoose.connect(MONGO_URL);
    logger.info(' Database connected');
  } catch (err) {
    logger.error('DataBase connection error:', err);
    throw err;
  }
}

export function disconnectDB(): Promise<void> {
  return mongoose.disconnect();
}