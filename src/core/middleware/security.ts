import rateLimit from 'express-rate-limit';

export const security = rateLimit({
    windowMs: 60_000,
    max: 120, // 120 req/min/IP
});
