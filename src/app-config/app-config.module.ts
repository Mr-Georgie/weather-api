import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppConfigService } from "./app-config.service";

@Global()
@Module({
    imports: [ConfigModule],
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class AppConfigModule {}
