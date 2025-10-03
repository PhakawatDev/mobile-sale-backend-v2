"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogger = exports.coreLogger = void 0;
require("dotenv/config");
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const isProd = process.env.NODE_ENV === 'production';
const level = (process.env.LOG_LEVEL ?? 'info').toLowerCase();
// ----- base format -----
const base = winston_1.default.format((info) => info);
const classPrefix = winston_1.default.format((info) => {
    if (info.class) {
        info.message = `[${String(info.class)}] ${info.message}`;
        delete info.class;
    }
    return info;
});
// ----- dev/prod formats -----
const devFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), base(), classPrefix(), winston_1.default.format.printf(({ level, message, timestamp, ...meta }) => {
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${extra}`;
}));
const prodFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), base(), classPrefix(), winston_1.default.format.json());
// ----- transports -----
const transports = [];
if (isProd) {
    transports.push(new winston_daily_rotate_file_1.default({
        dirname: 'logs',
        filename: 'app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        level,
    }), new winston_1.default.transports.Console({ level, format: prodFormat }));
}
else {
    transports.push(new winston_1.default.transports.Console({ level, format: devFormat }));
}
// ----- core logger -----
exports.coreLogger = winston_1.default.createLogger({
    level,
    format: isProd ? prodFormat : devFormat,
    transports,
    exceptionHandlers: [new winston_1.default.transports.Console({ format: prodFormat })],
    rejectionHandlers: [new winston_1.default.transports.Console({ format: prodFormat })],
    exitOnError: false,
});
// ----- NestJS style wrapper -----
class AppLogger {
    constructor(context) {
        this.context = context;
        const className = typeof context === 'string' ? context : context.name;
        this.logger = exports.coreLogger.child({ class: className });
    }
    info(message, meta) {
        this.logger.info(message, meta);
    }
    error(message, meta) {
        this.logger.error(message, meta);
    }
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
    debug(message, meta) {
        this.logger.debug(message, meta);
    }
    verbose(message, meta) {
        this.logger.verbose(message, meta);
    }
}
exports.AppLogger = AppLogger;
