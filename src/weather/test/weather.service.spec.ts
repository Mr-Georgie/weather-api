import { Test, TestingModule } from "@nestjs/testing";
import { WeatherService } from "../weather.service";
import { CacheService } from "src/cache/cache.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { CurrentCityWeatherResponse } from "../interfaces/CurrentCityWeatherResponse";
import { CACHE_KEYS, CACHE_TTL } from "src/cache/cache.config";
import { ExternalApiService } from "src/external-api/external-api.service";
import { AppConfigService } from "src/app-config/app-config.service";
import { WeatherForecastResponse } from "../interfaces/WeatherForecastResponse";

describe("WeatherService", () => {
    let service: WeatherService;
    let cacheService: CacheService;
    let customLoggerService: CustomLoggerService;
    let externalApiService: ExternalApiService;
    let appConfigService: AppConfigService;

    const mockCacheService = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    };

    const mockCustomLoggerService = {
        log: jest.fn(),
        logAndThrow: jest.fn(),
        handleError: jest.fn(),
    };

    const mockExternalApiService = {
        fetchData: jest.fn(),
    };

    const mockAppConfigService = {
        getWeatherApiCurrentCityUrl: jest
            .fn()
            .mockResolvedValue("https://somecoolurl.com"),
        getWeatherApiCityForecastUrl: jest
            .fn()
            .mockResolvedValue("https://somecoolurl.com"),
        getWeatherApiKey: jest.fn().mockResolvedValue("939944399399393"),
    };

    const mockCityConditionData = {
        text: "Partly cloudy",
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
        code: 1003,
    };

    const mockCityCurrentData = {
        condition: mockCityConditionData,
        last_updated_epoch: 1658522700,
        last_updated: "2022-07-22 16:45",
        temp_c: 34.4,
        temp_f: 93.9,
        is_day: 1,
    };

    const mockWeatherForecastData = {
        location: {},
        current: mockCityCurrentData,
        forecast: {},
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WeatherService,
                { provide: CacheService, useValue: mockCacheService },
                {
                    provide: ExternalApiService,
                    useValue: mockExternalApiService,
                },
                {
                    provide: CustomLoggerService,
                    useValue: mockCustomLoggerService,
                },
                {
                    provide: AppConfigService,
                    useValue: mockAppConfigService,
                },
            ],
        }).compile();

        service = module.get<WeatherService>(WeatherService);
        cacheService = module.get<CacheService>(CacheService);
        externalApiService = module.get<ExternalApiService>(ExternalApiService);
        appConfigService = module.get<AppConfigService>(AppConfigService);
        customLoggerService =
            module.get<CustomLoggerService>(CustomLoggerService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getCurrentWeatherByCity", () => {
        const city = "lagos";
        const cacheKey = `${CACHE_KEYS.CURRENT_WEATHER}${city}`;

        it("should fetch a current city weather from external API if not found in the cache", async () => {
            jest.spyOn(cacheService, "get").mockResolvedValue(null);
            jest.spyOn(cacheService, "set").mockResolvedValue(undefined);
            jest.spyOn(externalApiService, "fetchData").mockResolvedValue(
                mockCityCurrentData,
            );

            const result = await service.getCurrentCityData(city);

            expect(result).toEqual(mockCityCurrentData);
            expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
            expect(cacheService.set).toHaveBeenCalledWith(
                cacheKey,
                mockCityCurrentData,
                CACHE_TTL.CURRENT_WEATHER,
            );
            expect(customLoggerService.log).toHaveBeenCalled();
        });

        it("should return a current city weather from the cache if found", async () => {
            const mockCacheCityData =
                mockCityCurrentData as unknown as CurrentCityWeatherResponse;

            jest.spyOn(cacheService, "get").mockResolvedValue(
                mockCacheCityData,
            );

            const result = await service.getCurrentCityData(city);

            expect(result).toEqual(mockCityCurrentData);
            expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
            expect(customLoggerService.log).toHaveBeenCalled();
        });
    });

    describe("getFiveDayForecast", () => {
        const city = "lagos";
        const cacheKey = `${CACHE_KEYS.FORECAST}${city}`;

        it("should fetch a 5-day forecast data from external API if not found in the cache", async () => {
            jest.spyOn(cacheService, "get").mockResolvedValue(null);
            jest.spyOn(cacheService, "set").mockResolvedValue(undefined);
            jest.spyOn(externalApiService, "fetchData").mockResolvedValue(
                mockWeatherForecastData,
            );
            jest.spyOn(service, "fetchWeatherData").mockResolvedValue(
                mockWeatherForecastData,
            );

            const result = await service.getFiveDayForecast(city);

            expect(result).toEqual(mockWeatherForecastData);
            expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
            expect(cacheService.set).toHaveBeenCalledWith(
                cacheKey,
                mockWeatherForecastData,
                CACHE_TTL.FORECAST,
            );
            expect(customLoggerService.log).toHaveBeenCalled();
        });

        it("should return a weather forecast for a city from the cache if found", async () => {
            const mockCachedWeatherForecast =
                mockWeatherForecastData as unknown as WeatherForecastResponse;

            jest.spyOn(cacheService, "get").mockResolvedValue(
                mockCachedWeatherForecast,
            );

            const result = await service.getCurrentCityData(city);

            expect(result).toEqual(mockCachedWeatherForecast);
            expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
            expect(customLoggerService.log).toHaveBeenCalled();
        });
    });
});
