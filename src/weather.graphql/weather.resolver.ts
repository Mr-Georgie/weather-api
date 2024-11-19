import { Resolver, Query, Args } from "@nestjs/graphql";
import { WeatherService } from "src/weather/weather.service";
import { CurrentCityWeather } from "./models/current.model";
import { CityArgs } from "./dto/city.dto";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GraphQLExceptionFilter } from "src/common/filters/graphql-exception.filter";
import { Throttle } from "@nestjs/throttler";
import { GqlThrottlerGuard } from "src/throttler/gql-throttler-guard";
import { RATE_LIMITS } from "src/throttler/rate-limit.config";

/**
 * GraphQL Resolver for handling weather-related queries.
 * This resolver provides endpoints to fetch the current weather for a specified city.
 */
@UseFilters(GraphQLExceptionFilter)
@Resolver()
@UseGuards(GqlThrottlerGuard)
export class WeatherResolver {
    /**
     * @param weatherService Service for fetching weather data from external APIs.
     * @param customLoggerService Service for logging errors and other runtime information.
     */
    constructor(private readonly weatherService: WeatherService) {}

    /**
     * Fetches the current weather for a specified city.
     * @param cityName Name of the city for which the current weather is requested.
     * @returns A `CurrentCityWeather` object containing current weather data, or `null` if not found.
     *
     * @example
     * Query:
     * ```
     * query {
     *   getCurrentCityWeather(city: "New York") {
     *     current {
     *        temp_c
     *      }
     *   }
     * }
     * ```
     */
    @UseGuards(GqlThrottlerGuard)
    @Throttle({ default: RATE_LIMITS.WEATHER })
    @Query(() => CurrentCityWeather, {
        nullable: true,
        description: `Get the current weather for a specified city.
        
        query {
            getCurrentCityWeather(city: "imo") {
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
        // sanitize to lowercase
        const city = args.city.toLowerCase();
        try {
            return await this.weatherService.getCurrentCityData(city);
        } catch (error) {
            throw error;
        }
    }
}
