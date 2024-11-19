import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PasswordService } from "../auth/password.service";
import { CustomLoggerService } from "./services/custom-logger.service";
import { AppConfigModule } from "src/app-config/app-config.module";
import { AppConfigService } from "src/app-config/app-config.service";

@Module({
    imports: [ConfigModule, AppConfigModule],
    providers: [PasswordService, CustomLoggerService, AppConfigService],
    exports: [PasswordService, CustomLoggerService],
})
export class CommonModule {}
