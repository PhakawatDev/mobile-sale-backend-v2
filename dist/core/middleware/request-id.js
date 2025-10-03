"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = requestId;
const crypto_1 = require("crypto");
function requestId(req, _res, next) {
    req.id ?? (req.id = (0, crypto_1.randomUUID)());
    next();
}
