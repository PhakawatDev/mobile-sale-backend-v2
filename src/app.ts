import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { randomUUID } from 'crypto';

import { errorHandler } from './core/http/error-handler';
import { requestId } from './core/middleware/request-id';
import { accessLog } from './core/middleware/logging';
import { security } from './core/middleware/security';
import { router } from './routes';

export function buildApp() {
  const app = express();

  // base middlewares
  app.use(requestId);
  app.use((req, _res, next) => {
    (req as any).id = randomUUID();
    next();
  });
  
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));

   // access log
   app.use(accessLog);
   app.use(security);

  // routes
  app.use('/api', router);

  // global error handler
  app.use(errorHandler);

  return app;
}
