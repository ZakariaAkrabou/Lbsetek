import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes/authRoutes/auth.route';
import adminRoutes from './routes/adminRoutes/admin.route';

const createApp = (): Application => {
  const app = express();


  app.use(helmet());
  app.use(cors({
    origin: '*'
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(morgan('dev'));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);


  app.use('/api/auth', routes);
  app.use('/api/admin', adminRoutes)



  return app;
};

export default createApp;
