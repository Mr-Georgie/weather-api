import { Injectable, RequestTimeoutException } from "@nestjs/common";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { WeatherResponse } from "./interfaces/WeatherResponse";
import { CacheService } from "src/cache/cache.service";
import { CACHE_KEYS, CACHE_TTL } from "src/cache/cache.config";
import { AppConfigService } from "src/app-config/app-config.service";
import { ExternalApiService } from "src/external-api/external-api.service";
import { LogMessagesEnum } from "src/common/enums/log-messages.enum";

@Injectable()
export class WeatherService {
    constructor(
        private readonly customLoggerService: CustomLoggerService,
        private readonly cacheService: CacheService<WeatherResponse>,
        private readonly appConfigService: AppConfigService,
        private readonly externalApiService: ExternalApiService,
    ) {}

    async getCurrentCityData(city: string): Promise<WeatherResponse> {
        const method = this.getCurrentCityData.name;
        const cacheKey = `${CACHE_KEYS.CURRENT_WEATHER}${city}`;

        let cityData = await this.cacheService.get(cacheKey);

        if (!cityData) {
            cityData = await this.fetchWeatherData(city);
            await this.cacheService.set(
                cacheKey,
                cityData,
                CACHE_TTL.CURRENT_WEATHER,
            );

            this.customLoggerService.log(
                method,
                LogMessagesEnum.CACHE_WRITE_SUCCESS,
            );
        } else {
            this.customLoggerService.log(
                method,
                LogMessagesEnum.CACHE_READ_SUCCESS,
            );
        }
        this.customLoggerService.log(method, JSON.stringify(cityData));

        return cityData;
    }

    private async fetchWeatherData(city: string): Promise<WeatherResponse> {
        const apiKey = this.appConfigService.getWeatherApiKey();
        const cityEndpoint =
            this.appConfigService.getWeatherApiCurrentCityUrl();
        const url = `${cityEndpoint}?q=${city}&key=${apiKey}`;

        try {
            return await this.externalApiService.fetchData<WeatherResponse>(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                },
            );
        } catch (error) {
            // Handle specific error cases
            if (error.message.includes("timed out")) {
                // Handle timeout specifically
                this.customLoggerService.logAndThrow(
                    `Weather data fetch timed out for ${city}`,
                    this.fetchWeatherData.name,
                    RequestTimeoutException,
                );
                // throw new Error();
            }
            this.customLoggerService.handleError(
                error.message,
                this.fetchWeatherData.name,
            );
        }
    }
}
