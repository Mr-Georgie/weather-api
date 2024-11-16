import { Module } from "@nestjs/common";
import { ExternalApiService } from "./external-api.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppConfigModule } from "src/app-config/app-config.module";
import { AppConfigService } from "src/app-config/app-config.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";

@Module({
    imports: [
        AppConfigModule,
        HttpModule.registerAsync({
            imports: [AppConfigModule],
            useFactory: (appConfigService: AppConfigService) => ({
                timeout: appConfigService.getHttpTimeoutLimit(),
                maxRedirects: appConfigService.getHttpMaxRedirect(),
            }),
            inject: [AppConfigService],
        }),
    ],
    providers: [ExternalApiService, CustomLoggerService],
    exports: [ExternalApiService],
})
export class ExternalApiModule {}
