import { Resolver, Query, Args } from "@nestjs/graphql";
import { WeatherService } from "src/weather/weather.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { WeatherForecast } from "./models/forecast.model";
import { CurrentCityWeather } from "./models/current.model";
import { CityArgs } from "./dto/city.dto";
import { GraphQLError } from "graphql";

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
     * @returns A `WeatherForecast` object containing the weather forecast data, or `null` if not found.
     *
     * @example
     * Query:
     * ```
     * query {
     *  getWeatherForecast(cityName: "new") {
     *       location {
     *          name
     *         country
     *     }
     * }
     *}
     * ```
     */
    @Query(() => WeatherForecast, {
        nullable: true,
        description: `Get the current weather for a specified city.

            Example Query:
            query {
                getWeatherForecast(cityName: "leeds") {
                    location {
                        name
                        country
                        lat
                        lon
                        region
                    }
                    current {
                        temp_c
                        condition {
                            text
                            icon
                        }
                    }
                    forecast {
                        forecastday {
                            date
                            day {
                            maxtemp_c
                            mintemp_c
                            condition {
                                text
                            }
                            }
                            hour {
                            time
                            temp_c
                            condition {
                                text
                            }
                            }
                        }
                    }
                    alerts {
                        alert {
                            headline
                            event
                            desc
                        }
                    }
                }
            }`,
    })
    async getWeatherForecast(
        @Args() args: CityArgs,
    ): Promise<WeatherForecast | null> {
        try {
            return await this.weatherService.getFiveDayForecast(args.city);
        } catch (error) {
            throw error;
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
     *      }
     *   }
     * }
     * ```
     */
    @Query(() => CurrentCityWeather, {
        nullable: true,
        description: `Get the current weather for a specified city.
        
        query {
            getCurrentCityWeather(cityName: "imo") {
                location {
                    name
                    country
                    lat
                    lon
                    region
                    tz_id
                }
                current {
                    temp_c
                    condition {
                        text
                        icon
                    }
                }
            }
        }
        
        `,
    })
    async getCurrentCityWeather(
        @Args() args: CityArgs,
    ): Promise<CurrentCityWeather | null> {
        try {
            return await this.weatherService.getCurrentCityData(args.city);
        } catch (error) {
            throw error;
        }
    }
}
