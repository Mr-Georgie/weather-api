import { Module } from "@nestjs/common";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LocalStrategy } from "./strategy/local.strategy";
import { LocalAuthGuard } from "./security/local-auth.guard";
import { JwtAuthGuard } from "./security/jwt-auth.guard";
import { UsersService } from "src/users/users.service";
import { UsersModule } from "src/users/user.module";
import { User } from "src/database/entities/users.entity";
import { CommonModule } from "src/common/common.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { CacheModule } from "src/cache/cache.module";
import { CacheService } from "src/cache/cache.service";
import { AppConfigService } from "src/app-config/app-config.service";
import { AppConfigModule } from "src/app-config/app-config.module";

@Module({
    imports: [
        AppConfigModule,
        CommonModule,
        UsersModule,
        PassportModule,
        CacheModule,
        JwtModule.registerAsync({
            imports: [AppConfigModule],
            useFactory: async (appConfigService: AppConfigService) => ({
                secret: appConfigService.getJwtSecret(),
                signOptions: {
                    expiresIn: appConfigService.getTokenExpirationTime(),
                },
            }),
            inject: [AppConfigService],
        }),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AuthController],
    providers: [
        AppConfigService,
        AuthService,
        UsersService,
        CustomLoggerService,
        CacheService,
        LocalStrategy,
        LocalAuthGuard,
        JwtAuthGuard,
        JwtStrategy,
    ],
    exports: [JwtModule, TypeOrmModule],
})
export class AuthModule {}
