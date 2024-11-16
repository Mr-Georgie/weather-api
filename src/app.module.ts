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

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get("DATABASE_HOST"),
                port: configService.get("DATABASE_PORT"),
                username: configService.get("DATABASE_USER"),
                password: configService.get("DATABASE_PASS"),
                database: configService.get("DATABASE_NAME"),
                entities: [
                    __dirname + "/database/entities/**/*.entity{.ts,.js}",
                ],
                synchronize: false,
                autoLoadEntities: true,
                namingStrategy: new SnakeNamingStrategy(),
                softDelete: true,
            }),
            inject: [ConfigService],
        }),

        AuthModule,
        CacheModule,
        UsersModule,
        WeatherGraphqlModule,
    ],
    controllers: [AppController],
    providers: [AppService, UsersService],
})
export class AppModule {}
