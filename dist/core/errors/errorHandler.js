"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("./AppError");
function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
    }
    const e = err;
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: e?.message ?? 'Internal error' } });
}
