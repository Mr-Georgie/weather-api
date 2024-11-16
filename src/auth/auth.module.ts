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

@Module({
    imports: [
        CommonModule,
        UsersModule,
        PassportModule,
        CacheModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: {
                    expiresIn: parseInt(
                        configService.getOrThrow<string>(
                            "ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC",
                        ),
                    ),
                },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AuthController],
    providers: [
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
