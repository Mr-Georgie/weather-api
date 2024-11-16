import { Module } from "@nestjs/common";
import { User } from "../database/entities/users.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { CacheService } from "src/cache/cache.service";
import { CacheModule } from "src/cache/cache.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), CacheModule],
    providers: [UsersService, CustomLoggerService, CacheService],
    controllers: [UsersController],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
