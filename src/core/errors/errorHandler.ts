import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
    }
    const e = err as any;
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: e?.message ?? 'Internal error' } });
}
