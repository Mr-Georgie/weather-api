import { Module } from "@nestjs/common";
import { WeatherService } from "./weather.service";
import { ExternalApiModule } from "src/external-api/external-api.module";
import { AppConfigModule } from "src/app-config/app-config.module";
import { AppConfigService } from "src/app-config/app-config.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { CacheService } from "src/cache/cache.service";
import { CacheModule } from "src/cache/cache.module";

@Module({
    imports: [ExternalApiModule, AppConfigModule, CacheModule],
    providers: [
        WeatherService,
        AppConfigService,
        CustomLoggerService,
        CacheService,
    ],
    exports: [
        WeatherService,
        AppConfigService,
        CustomLoggerService,
        CacheService,
    ],
})
export class WeatherModule {}
