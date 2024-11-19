import { Logger, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/user.module";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { WeatherGraphqlModule } from "./weather.graphql/weather.graphql.module";
import { ExternalApiModule } from "./external-api/external-api.module";
import { AppConfigService } from "./app-config/app-config.service";
import { AppConfigModule } from "./app-config/app-config.module";
import { WeatherModule } from "./weather/weather.module";
import { LocationsModule } from "./locations/locations.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import { GqlThrottlerGuard } from "./throttler/gql-throttler-guard";
import { CustomThrottlerModule } from "./throttler/throttler.module";
import { ScheduleModule } from "@nestjs/schedule";
import { BullModule } from "@nestjs/bull";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (appConfigService: AppConfigService) => ({
                type: "postgres",
                host: appConfigService.getDbHost(),
                port: appConfigService.getDbPort(),
                username: appConfigService.getDbUsername(),
                password: appConfigService.getDbPassword(),
                database: appConfigService.getDbName(),
                entities: [
                    __dirname + "/database/entities/**/*.entity{.ts,.js}",
                ],
                synchronize: false,
                autoLoadEntities: true,
                namingStrategy: new SnakeNamingStrategy(),
                softDelete: true,
            }),
        }),
        BullModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (appConfigService: AppConfigService) => ({
                redis: appConfigService.getRedisUrl(),
            }),
        }),

        CustomThrottlerModule,
        AuthModule,
        ExternalApiModule,
        CacheModule,
        UsersModule,
        WeatherModule,
        WeatherGraphqlModule,
        ExternalApiModule,
        LocationsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
