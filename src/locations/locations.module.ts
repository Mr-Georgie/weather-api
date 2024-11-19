import { Module } from "@nestjs/common";
import { LocationsService } from "./locations.service";
import { LocationsController } from "./locations.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheService } from "src/cache/cache.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { Location } from "src/database/entities/locations.entity";
import { CacheModule } from "src/cache/cache.module";

@Module({
    imports: [TypeOrmModule.forFeature([Location]), CacheModule],
    controllers: [LocationsController],
    providers: [LocationsService, CustomLoggerService, CacheService],
    exports: [LocationsService],
})
export class LocationsModule {}
