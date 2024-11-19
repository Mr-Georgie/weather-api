export const RATE_LIMITS = {
    PUBLIC: {
        ttl: Number(process.env.PUBLIC_RATE_LIMIT_TTL),
        limit: Number(process.env.PUBLIC_RATE_LIMIT),
    },
    AUTHENTICATED: {
        ttl: Number(process.env.AUTH_RATE_LIMIT_TTL),
        limit: Number(process.env.AUTH_RATE_LIMIT),
    },
    WEATHER: {
        ttl: Number(process.env.AUTH_RATE_LIMIT_TTL),
        limit: Number(process.env.AUTH_RATE_LIMIT),
    },
    FORECAST: {
        ttl: Number(process.env.AUTH_RATE_LIMIT_TTL),
        limit: Number(process.env.AUTH_RATE_LIMIT),
    },
    STORAGE_URL: process.env.REDIS_URL,
};
