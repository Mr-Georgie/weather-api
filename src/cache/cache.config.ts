export const CACHE_KEYS = {
    CURRENT_WEATHER: "weather:current:",
    FORECAST: "weather:forecast:",
    RATE_LIMIT: "ratelimit:",
} as const;

export const CACHE_TTL = {
    CURRENT_WEATHER: 60000 * 5, // 5 minutes
    FORECAST: 60000 * 60, // 1 hour
} as const;


