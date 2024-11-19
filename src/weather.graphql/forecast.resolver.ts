import { Resolver, Query, Args } from "@nestjs/graphql";
import { WeatherService } from "src/weather/weather.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { WeatherForecast } from "./models/forecast.model";
import { CityArgs } from "./dto/city.dto";
import { GraphQLExceptionFilter } from "src/common/filters/graphql-exception.filter";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlThrottlerGuard } from "src/throttler/gql-throttler-guard";
import { Throttle } from "@nestjs/throttler";
import { AppConfigService } from "src/app-config/app-config.service";
import { RATE_LIMITS } from "src/throttler/rate-limit.config";
// import { Throttle } from "@nestjs/throttler";

/**
 * GraphQL Resolver for handling weather-related queries.
 * This resolver provides endpoints to fetch the 5-day weather forecast
 */
@UseFilters(GraphQLExceptionFilter)
@Resolver(() => WeatherForecast)
@UseGuards(GqlThrottlerGuard)
export class ForecastResolver {
    /**
     * @param weatherService Service for fetching weather data from external APIs.
     * @param customLoggerService Service for logging errors and other runtime information.
     */
    constructor(
        private readonly weatherService: WeatherService,
        private readonly customLoggerService: CustomLoggerService,
        private readonly appConfigService: AppConfigService,
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
     *  getWeatherForecast(city: "new") {
     *       location {
     *          name
     *         country
     *     }
     * }
     *}
     * ```
     */
    @UseGuards(GqlThrottlerGuard)
    @Throttle({ default: RATE_LIMITS.FORECAST })
    @Query(() => WeatherForecast, {
        nullable: true,
        description: `Get the weather forecast for a specified city.

            Example Query:
            query {
                getWeatherForecast(city: "leeds") {
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
        // sanitize to lowercase
        const city = args.city.toLowerCase();
        try {
            return await this.weatherService.getFiveDayForecast(city);
        } catch (error) {
            throw error;
        }
    }
}
