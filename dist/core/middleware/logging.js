"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessLog = accessLog;
const logger_1 = require("../logger/logger");
function accessLog(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        const status = res.statusCode;
        if (status >= 400) {
            const log = logger_1.coreLogger.child({ class: 'AccessLog' });
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
