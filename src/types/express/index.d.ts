import 'express-serve-static-core';
declare module 'express-serve-static-core' {
  interface Request {
    id?: string;
  }
}

import 'express';
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export {}; 