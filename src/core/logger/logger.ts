import 'dotenv/config';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import type Transport from 'winston-transport';

const isProd = process.env.NODE_ENV === 'production';
const level = (process.env.LOG_LEVEL ?? 'info').toLowerCase() as
    | 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

// ----- base format -----
const base = winston.format((info) => info);

const classPrefix = winston.format((info) => {
    if (info.class) {
        info.message = `[${String(info.class)}] ${info.message}`;
        delete (info as any).class;
    }
    return info;
});

// ----- dev/prod formats -----
const devFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    base(),
    classPrefix(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] ${level}: ${message}${extra}`;
    }),
);

const prodFormat = winston.format.combine(
    winston.format.timestamp(),
    base(),
    classPrefix(),
    winston.format.json(),
);

// ----- transports -----
const transports: Transport[] = [];
if (isProd) {
    transports.push(
        new DailyRotateFile({
            dirname: 'logs',
            filename: 'app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            level,
        }),
        new winston.transports.Console({ level, format: prodFormat }),
    );
} else {
    transports.push(new winston.transports.Console({ level, format: devFormat }));
}

// ----- core logger -----
export const coreLogger = winston.createLogger({
    level,
    format: isProd ? prodFormat : devFormat,
    transports,
    exceptionHandlers: [new winston.transports.Console({ format: prodFormat })],
    rejectionHandlers: [new winston.transports.Console({ format: prodFormat })],
    exitOnError: false,
});

// ----- NestJS style wrapper -----
export class AppLogger {
    private readonly logger: winston.Logger;

    constructor(private readonly context: Function | string) {
        const className = typeof context === 'string' ? context : context.name;
        this.logger = coreLogger.child({ class: className });
    }

    info(message: string, meta?: Record<string, any>) {
        this.logger.info(message, meta);
    }

    error(message: string, meta?: Record<string, any>) {
        this.logger.error(message, meta);
    }

    warn(message: string, meta?: Record<string, any>) {
        this.logger.warn(message, meta);
    }

    debug(message: string, meta?: Record<string, any>) {
        this.logger.debug(message, meta);
    }

    verbose(message: string, meta?: Record<string, any>) {
        this.logger.verbose(message, meta);
    }
}
