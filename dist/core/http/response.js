"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.created = created;
exports.paged = paged;
exports.fail = fail;
function base(req) {
    return {
        requestId: req?.id, // ถ้ามี req.id จาก middleware
        timestamp: new Date().toISOString(),
    };
}
function ok(res, req, data, opts) {
    const payload = {
        success: true,
        message: opts?.message ?? 'OK',
        data,
        size: typeof opts?.size === 'number' ? opts.size : Array.isArray(data) ? data.length : undefined,
        meta: opts?.meta,
        ...base(req),
    };
    return res.status(200).json(payload);
}
function created(res, req, data, opts) {
    const payload = {
        success: true,
        message: opts?.message ?? 'Created',
        data,
        ...base(req),
    };
    return res.status(201).json(payload);
}
function paged(res, req, data, meta, opts) {
    const payload = {
        success: true,
        message: opts?.message ?? 'OK',
        data,
        size: data.length,
        meta,
        ...base(req),
    };
    return res.status(200).json(payload);
}
function fail(res, req, message, status = 400, opts) {
    const payload = {
        success: false,
        message,
        code: opts?.code,
        details: opts?.details,
        ...base(req),
    };
    return res.status(status).json(payload);
}
