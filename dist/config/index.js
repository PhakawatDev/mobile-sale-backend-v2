"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
exports.config = {
    app: {
        env: process.env.NODE_ENV ?? 'development',
        port: Number(process.env.PORT ?? 3000),
    },
    db: {
        url: process.env.DATABASE_URL,
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET,
    },
};
