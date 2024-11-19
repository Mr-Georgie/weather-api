import { Module } from "@nestjs/common";
import { Cacheable } from "cacheable";
import { CacheService } from "./cache.service";
import KeyvRedis from "@keyv/redis";
import { ConfigService } from "@nestjs/config";
import { AppConfigService } from "src/app-config/app-config.service";
import { AppConfigModule } from "src/app-config/app-config.module";

@Module({
    imports: [AppConfigModule],
    providers: [
        {
            provide: "CACHE_INSTANCE",
            useFactory: (appConfigService: AppConfigService) => {
                const host = appConfigService.getRedisHost();
                const port = appConfigService.getRedisPort();
                const password = appConfigService.getRedisPassword();
                const db = appConfigService.getRedisDbName();
                const username = appConfigService.getRedisUsername();
                const ttl = appConfigService.getRedisTtl();
                const secondary = new KeyvRedis(
                    `redis://${username}:${password}@${host}:${port}/${db}`,
                );
                return new Cacheable({ secondary, ttl });
            },
            inject: [AppConfigService],
        },
        AppConfigService,
        CacheService,
    ],
    exports: ["CACHE_INSTANCE"],
})
export class CacheModule {}
