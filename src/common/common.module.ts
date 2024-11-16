import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PasswordService } from "./services/password.service";
import { AppConfigService } from "./services/app-config.service";
import { HttpModule } from "@nestjs/axios";
import { CustomLoggerService } from "./services/custom-logger.service";

@Module({
    imports: [
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                timeout: configService.get("HTTP_TIMEOUT"),
                maxRedirects: configService.get("HTTP_MAX_REDIRECTS"),
            }),
            inject: [ConfigService],
        }),
        ConfigModule,
    ],
    providers: [PasswordService, AppConfigService, CustomLoggerService],
    exports: [PasswordService, AppConfigService, CustomLoggerService],
})
export class CommonModule {}
