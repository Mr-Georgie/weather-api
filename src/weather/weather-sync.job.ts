import { Injectable } from "@nestjs/common";
import { LocationsService } from "src/locations/locations.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";

@Injectable()
export class WeatherSyncJob {
    constructor(
        private locationService: LocationsService,
        @InjectQueue("weather-sync-queue") private readonly queue: Queue,
    ) {}

    @Cron(CronExpression.EVERY_30_MINUTES)
    async syncFavoriteLocationsWeather() {
        const favoriteLocations =
            await this.locationService.findAllFavoriteLocations();

        for (const city of favoriteLocations) {
            await this.queue.add(
                "sync",
                { city },
                {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 1000,
                    },
                },
            );
        }
    }
}
