import { Module } from "@nestjs/common";
import { Cacheable } from "cacheable";
import { CacheService } from "./cache.service";
import KeyvRedis from "@keyv/redis";
import { ConfigService } from "@nestjs/config";

@Module({
    providers: [
        {
            provide: "CACHE_INSTANCE",
            useFactory: (configService: ConfigService) => {
                const host = configService.get("REDIS_HOST");
                const port = configService.get("REDIS_PORT");
                const password = configService.get("REDIS_PASS");
                const db = configService.get("REDIS_DB");
                const username = configService.get("REDIS_USER");
                const ttl = configService.get("REDIS_TTL");
                const secondary = new KeyvRedis(
                    `redis://${username}:${password}@${host}:${port}/${db}`,
                );
                return new Cacheable({ secondary, ttl });
            },
            inject: [ConfigService],
        },
        CacheService,
    ],
    exports: ["CACHE_INSTANCE"],
})
export class CacheModule {}
