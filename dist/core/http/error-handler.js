"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const logger_1 = require("../logger/logger");
const AppError_1 = require("./AppError");
const isProd = process.env.NODE_ENV === 'production';
const log = logger_1.coreLogger.child({ class: 'ErrorHandler' });
function errorHandler(err, req, res, _next) {
    if (err instanceof AppError_1.AppError) {
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
    if (err instanceof zod_1.ZodError) {
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
    const anyErr = err;
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
