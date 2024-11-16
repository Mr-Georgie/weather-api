import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {}

    getJwtSecret(): string {
        return this.getStringConfig("JWT_SECRET");
    }

    getTokenExpirationTime(): number {
        return this.getNumberConfig(
            "ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC",
            3600000,
        ); // 1 hour default
    }

    getBcryptSaltRounds(): number {
        return this.getNumberConfig("BCRYPT_SALT_ROUNDS", 10); // Default to 10 if not specified
    }

    getHttpRetriesLimit(): number {
        return this.getNumberConfig("HTTP_RETRIES", 3); // Default to 3 if not specified
    }

    getHttpTimeoutLimit(): number {
        return this.getNumberConfig("HTTP_TIMEOUT", 5000); // Default to 5000 if not specified
    }

    getHttpMaxRedirect(): number {
        return this.getNumberConfig("HTTP_MAX_REDIRECTS", 5); // Default to 5 if not specified
    }

    getExternalApiKey(): string {
        return this.getStringConfig("EXTERNAL_API_KEY");
    }

    getDbHost(): string {
        return this.getStringConfig("DATABASE_HOST");
    }
    getDbPort(): number {
        return this.getNumberConfig("DATABASE_PORT");
    }
    getDbUsername(): string {
        return this.getStringConfig("DATABASE_USER");
    }
    getDbPassword(): string {
        return this.getStringConfig("DATABASE_PASS");
    }
    getDbName(): string {
        return this.getStringConfig("DATABASE_NAME");
    }

    getRedisHost(): string {
        return this.getStringConfig("REDIS_HOST");
    }
    getRedisPort(): number {
        return this.getNumberConfig("REDIS_PORT");
    }
    getRedisUsername(): string {
        return this.getStringConfig("REDIS_USER");
    }
    getRedisPassword(): string {
        return this.getStringConfig("REDIS_PASS");
    }

    getRedisName(): string {
        return this.getStringConfig("REDIS_DB");
    }
    getRedisTtl(): number {
        return this.getNumberConfig("REDIS_TTL");
    }

    getWeatherApiKey(): string {
        return this.getStringConfig("WEATHER_API_KEY");
    }

    getWeatherApiCurrentCityUrl(): string {
        return this.getStringConfig("WEATHER_API_CURRENT_CITY_URL");
    }
    getWeatherApiCityForecastUrl(): string {
        return this.getStringConfig("WEATHER_API_CITY_FORECAST_URL");
    }

    private getStringConfig(key: string, defaultValue?: string): string {
        try {
            const value = this.configService.getOrThrow<string>(key);

            if (value.trim() === "") {
                throw new Error(`Config value for ${key} is an empty string`);
            }

            return value;
        } catch (error) {
            if (defaultValue !== undefined) {
                return defaultValue;
            }
            throw error;
        }
    }

    private getNumberConfig(key: string, defaultValue?: number): number {
        try {
            const value = this.configService.getOrThrow<string>(key);
            const parsedValue = parseInt(value, 10);

            if (isNaN(parsedValue)) {
                throw new Error(
                    `Config value for ${key} is not a valid number`,
                );
            }

            return parsedValue;
        } catch (error) {
            if (defaultValue !== undefined) {
                return defaultValue;
            }
            throw error;
        }
    }
}
