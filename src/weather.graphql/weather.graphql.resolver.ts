import { Resolver, Query, Args } from "@nestjs/graphql";
import { WeatherService } from "src/weather/weather.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { ForecastWeather } from "./models/forecast.model";
import { CurrentCityWeather } from "./models/current.model";

/**
 * GraphQL Resolver for handling weather-related queries.
 * This resolver provides endpoints to fetch both the 5-day weather forecast
 * and the current weather for a specified city.
 */
@Resolver()
export class WeatherGraphqlResolver {
    /**
     * @param weatherService Service for fetching weather data from external APIs.
     * @param customLoggerService Service for logging errors and other runtime information.
     */
    constructor(
        private readonly weatherService: WeatherService,
        private readonly customLoggerService: CustomLoggerService,
    ) {}

    /**
     * Fetches a 5-day weather forecast for a specified city.
     * @param cityName Name of the city for which the forecast is requested.
     * @returns A `ForecastWeather` object containing the weather forecast data, or `null` if not found.
     *
     * @example
     * Query:
     * ```
     * query {
     *  getCurrentCityWeather(cityName: "new") {
     *       location {
     *          name
     *         country
     *     }
     * }
     *}
     * ```
     */
    @Query(() => ForecastWeather, {
        nullable: true,
        description: "Get a 5-day weather forecast for a specified city.",
    })
    async getForecastWeather(
        @Args("cityName", {
            description:
                "The name of the city for which to retrieve the weather forecast.",
        })
        cityName: string,
    ): Promise<ForecastWeather | null> {
        try {
            return await this.weatherService.getFiveDayForecast(cityName);
        } catch (error) {
            this.customLoggerService.handleError(
                error.message,
                this.getForecastWeather.name,
            );
            return null;
        }
    }

    /**
     * Fetches the current weather for a specified city.
     * @param cityName Name of the city for which the current weather is requested.
     * @returns A `CurrentCityWeather` object containing current weather data, or `null` if not found.
     *
     * @example
     * Query:
     * ```
     * query {
     *   getCurrentCityWeather(cityName: "New York") {
     *     current {
     *        temp_c
     *        condition {
     *            text
     *            icon
     *        }
     *      }
     *   }
     * }
     * ```
     */
    @Query(() => CurrentCityWeather, {
        nullable: true,
        description: "Get the current weather for a specified city.",
    })
    async getCurrentCityWeather(
        @Args("cityName", {
            description:
                "The name of the city for which to retrieve the current weather.",
        })
        cityName: string,
    ): Promise<CurrentCityWeather | null> {
        try {
            return await this.weatherService.getCurrentCityData(cityName);
        } catch (error) {
            this.customLoggerService.handleError(
                error.message,
                this.getCurrentCityWeather.name,
            );
            return null;
        }
    }
}
