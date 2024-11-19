import { Module } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { GqlThrottlerGuard } from "./gql-throttler-guard";
import { RestThrottlerGuard } from "./rest-throttler-guard";
import { AppConfigModule } from "src/app-config/app-config.module";
import { AppConfigService } from "src/app-config/app-config.service";
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: async (appConfigService: AppConfigService) => {
                const storage = new ThrottlerStorageRedisService(
                    appConfigService.getRedisUrl(),
                );

                return {
                    throttlers: [
                        {
                            ttl: appConfigService.getPublicRateLimitTtl(),
                            limit: appConfigService.getPublicRateLimit(),
                        },
                    ],
                    storage,
                };
            },
        }),
    ],
    providers: [RestThrottlerGuard, GqlThrottlerGuard],
    exports: [RestThrottlerGuard, GqlThrottlerGuard],
})
export class CustomThrottlerModule {}
