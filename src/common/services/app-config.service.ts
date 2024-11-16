import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {}

    getNumberConfig(key: string, defaultValue?: number): number {
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

    getTokenExpirationTime(
        durationKey: string = 'ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC',
    ): number {
        return this.getNumberConfig(durationKey, 3600000); // 1 hour default
    }

    getBcryptSaltRounds(): number {
        return this.getNumberConfig('BCRYPT_SALT_ROUNDS', 10); // Default to 10 if not specified
    }

    getHttpRetriesLimit(): number {
        return this.getNumberConfig('HTTP_RETRIES', 3); // Default to 3 if not specified
    }

    getHttpTimeoutLimit(): number {
        return this.getNumberConfig('HTTP_TIMEOUT', 5000); // Default to 5000 if not specified
    }
}
