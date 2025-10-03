import { Request, Response, NextFunction } from 'express';
import { coreLogger } from '../logger/logger';

export function accessLog(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
        const ms = Date.now() - start;
        const status = res.statusCode;

        if (status >= 400) {
            const log = coreLogger.child({ class: 'AccessLog' });
            log.info('REQUEST', {
                method: req.method,
                url: req.originalUrl,
                status,
                durationMs: ms,
                contentLength: res.getHeader('content-length') ?? 0,
            });
        }
    });

    next();
}
