import { Process, Processor } from "@nestjs/bull";
import { WeatherService } from "./weather.service";
import { CacheService } from "src/cache/cache.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { Job } from "bull";
import { WeatherForecastResponse } from "./interfaces/WeatherForecastResponse";
import { CACHE_KEYS, CACHE_TTL } from "src/cache/cache.config";
import { LogMessagesEnum } from "src/common/enums/log-messages.enum";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { InternalServerErrorException } from "@nestjs/common";

@Processor("weather-sync-queue")
export class WeatherSyncProcessor {
    constructor(
        private weatherService: WeatherService,
        private readonly customLoggerService: CustomLoggerService,
        private readonly cacheService: CacheService,
    ) {}

    @Process({ concurrency: 5, name: "sync" })
    async processWeatherSync(job: Job<{ city: string }>) {
        const { city } = job.data;

        try {
            const forecastData =
                await this.weatherService.fetchWeatherData<WeatherForecastResponse>(
                    city,
                    5,
                );

            const cacheKey = `${CACHE_KEYS.FORECAST}${city}`;

            await this.cacheService.set<WeatherForecastResponse>(
                cacheKey,
                forecastData,
                CACHE_TTL.FORECAST,
            );

            this.customLoggerService.log(
                "WeatherSync",
                LogMessagesEnum.CACHE_WRITE_SUCCESS,
            );

            return { success: true };
        } catch (error) {
            this.customLoggerService.logAndThrow(
                `Failed to sync weather for ${city}`,
                "WeatherSync",
                InternalServerErrorException,
            );
        }
    }
}
