import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { coreLogger } from '../logger/logger';
import { AppError } from './AppError';
import { fail } from './response';

const isProd = process.env.NODE_ENV === 'production';
const log = coreLogger.child({ class: 'ErrorHandler' });

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof AppError) {
        log.warn('APP_ERROR', {
            code: err.code,
            message: err.message,
            statusCode: err.statusCode,
            path: req.originalUrl,
            method: req.method,
        });

        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
            },
        });
    }

    // ---- ZodError (validation) ----
    if (err instanceof ZodError) {
        const details = err.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
        }));

        log.warn('VALIDATION_ERROR', {
            path: req.originalUrl,
            method: req.method,
            issues: details,
        });

        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid request',
                details,
            },
        });
    }

    // ---- Unknown / Unhandled ----
    const anyErr = err as { message?: string; stack?: string };
    const message = anyErr?.message ?? 'Internal Server Error';

    log.error('UNHANDLED_ERROR', {
        path: req.originalUrl,
        method: req.method,
        message,
        stack: anyErr?.stack,
    });

    return res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message,
            ...(isProd ? {} : { stack: anyErr?.stack }),
        },
    });
}
