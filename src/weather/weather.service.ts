import { Injectable, RequestTimeoutException } from "@nestjs/common";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { CurrentCityWeatherResponse } from "./interfaces/CurrentCityWeatherResponse";
import { CacheService } from "src/cache/cache.service";
import { CACHE_KEYS, CACHE_TTL } from "src/cache/cache.config";
import { AppConfigService } from "src/app-config/app-config.service";
import { ExternalApiService } from "src/external-api/external-api.service";
import { LogMessagesEnum } from "src/common/enums/log-messages.enum";
import { WeatherForecastResponse } from "./interfaces/WeatherForecastResponse";

@Injectable()
export class WeatherService {
    constructor(
        private readonly customLoggerService: CustomLoggerService,
        private readonly cacheService: CacheService,
        private readonly appConfigService: AppConfigService,
        private readonly externalApiService: ExternalApiService,
    ) {}

    async getCurrentCityData(
        city: string,
    ): Promise<CurrentCityWeatherResponse> {
        const method = this.getCurrentCityData.name;
        const cacheKey = `${CACHE_KEYS.CURRENT_WEATHER}${city}`;

        let cityData =
            await this.cacheService.get<CurrentCityWeatherResponse>(cacheKey);

        if (!cityData) {
            cityData = await this.fetchWeatherData(city);
            await this.cacheService.set<CurrentCityWeatherResponse>(
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

        return cityData as CurrentCityWeatherResponse;
    }

    async getFiveDayForecast(city: string): Promise<WeatherForecastResponse> {
        const method = this.getFiveDayForecast.name;
        const cacheKey = `${CACHE_KEYS.FORECAST}${city}`;

        let forecastData =
            await this.cacheService.get<WeatherForecastResponse>(cacheKey);

        if (!forecastData) {
            forecastData = await this.fetchWeatherData<WeatherForecastResponse>(
                city,
                5,
            );
            await this.cacheService.set<WeatherForecastResponse>(
                cacheKey,
                forecastData,
                CACHE_TTL.FORECAST,
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
        this.customLoggerService.log(
            method,
            JSON.stringify(this.sanitizeDataForLogging(forecastData)),
        );

        return forecastData;
    }

    private async fetchWeatherData<T>(city: string, days?: number): Promise<T> {
        const method = this.fetchWeatherData.name;
        const apiKey = this.appConfigService.getWeatherApiKey();
        const cityEndpoint =
            this.appConfigService.getWeatherApiCurrentCityUrl();
        const forecastEndpoint =
            this.appConfigService.getWeatherApiCityForecastUrl();

        const baseUrl = `${days ? forecastEndpoint : cityEndpoint}`;
        const url = `${baseUrl}?q=${city}&key=${apiKey}${days ? `&days=${days}` : ""}`;

        this.customLoggerService.log(method, `url: ${url}`);

        try {
            if (days) {
                return await this.externalApiService.fetchData<T>(url, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                });
            }
            return await this.externalApiService.fetchData<T>(url, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            });
        } catch (error) {
            // throw the error from the external api service
            throw error;
        }
    }

    private sanitizeDataForLogging(data: any): any {
        if (!data) return null;

        // For weather data, return essential fields only
        return {
            cityName: data.location?.name,
            country: data.location?.country,
            currentTemp: data.current?.temp_c,
            forecastDaysCount: data.forecast?.forecastday?.length || 0,
            alertsCount: data.alerts?.alert?.length || 0,
            dataTimestamp: data.current?.last_updated,
        };
    }
}
