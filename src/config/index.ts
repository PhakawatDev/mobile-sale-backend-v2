import 'dotenv/config';

export const config = {
    app: {
        env: process.env.NODE_ENV ?? 'development',
        port: Number(process.env.PORT ?? 3000),
    },
    db: {
        url: process.env.DATABASE_URL!,
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET!,
    },
} as const;
