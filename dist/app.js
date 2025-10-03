"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const crypto_1 = require("crypto");
const error_handler_1 = require("./core/http/error-handler");
const request_id_1 = require("./core/middleware/request-id");
const logging_1 = require("./core/middleware/logging");
const security_1 = require("./core/middleware/security");
const routes_1 = require("./routes");
function buildApp() {
    const app = (0, express_1.default)();
    // base middlewares
    app.use(request_id_1.requestId);
    app.use((req, _res, next) => {
        req.id = (0, crypto_1.randomUUID)();
        next();
    });
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: '2mb' }));
    // access log
    app.use(logging_1.accessLog);
    app.use(security_1.security);
    // routes
    app.use('/api', routes_1.router);
    // global error handler
    app.use(error_handler_1.errorHandler);
    return app;
}
