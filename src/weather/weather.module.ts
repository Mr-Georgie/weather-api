import { Module } from "@nestjs/common";
import { WeatherService } from "./weather.service";
import { ExternalApiModule } from "src/external-api/external-api.module";
import { AppConfigModule } from "src/app-config/app-config.module";
import { AppConfigService } from "src/app-config/app-config.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { CacheService } from "src/cache/cache.service";
import { CacheModule } from "src/cache/cache.module";
import { WeatherSyncJob } from "./weather-sync.job";
import { LocationsService } from "src/locations/locations.service";
import { LocationsModule } from "src/locations/locations.module";
import { WeatherSyncProcessor } from "./weather-sync.processor";
import { BullModule } from "@nestjs/bull";

@Module({
    imports: [
        ExternalApiModule,
        AppConfigModule,
        CacheModule,
        LocationsModule,
        BullModule.registerQueue({
            name: "weather-sync-queue",
            defaultJobOptions: {
                removeOnComplete: true,
                timeout: 30000,
                removeOnFail: true,
            },
        }),
    ],
    providers: [
        WeatherService,
        AppConfigService,
        CustomLoggerService,
        CacheService,
        WeatherSyncJob,
        WeatherSyncProcessor,
    ],
    exports: [
        WeatherService,
        AppConfigService,
        CustomLoggerService,
        CacheService,
    ],
})
export class WeatherModule {}
