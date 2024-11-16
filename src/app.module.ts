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
import { UsersService } from "./users/users.service";
import { ExternalApiModule } from "./external-api/external-api.module";
import { AppConfigService } from "./app-config/app-config.service";
import { AppConfigModule } from "./app-config/app-config.module";
import { CustomLoggerService } from "./common/services/custom-logger.service";
import { CacheService } from "./cache/cache.service";
import { ExternalApiService } from "./external-api/external-api.service";
import { HttpModule, HttpService } from "@nestjs/axios";
import { WeatherModule } from "./weather/weather.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [AppConfigModule],
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
            inject: [AppConfigService],
        }),
        AuthModule,
        ExternalApiModule,
        CacheModule,
        UsersModule,
        WeatherModule,
        WeatherGraphqlModule,
        ExternalApiModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
