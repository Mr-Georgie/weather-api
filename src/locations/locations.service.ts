import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CacheService } from "src/cache/cache.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { Location } from "src/database/entities/locations.entity";
import { Repository } from "typeorm";
import { LocationDto } from "./dto/locations.dto";
import { LogMessagesEnum } from "src/common/enums/log-messages.enum";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { User } from "src/database/entities/users.entity";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
    createPaginatedResponse,
    PaginatedResponse,
} from "src/common/utils/paginated-response.utils";

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(Location)
        private locationsRepository: Repository<Location>,
        private readonly customLoggerService: CustomLoggerService,
        private readonly cacheService: CacheService,
    ) {}

    async create(locationDto: LocationDto, user_id: string): Promise<Location> {
        const method = this.create.name;

        // sanitize input
        const city = locationDto.city.toLowerCase();

        const existingCity = await this.locationsRepository.findOneBy({
            city,
        });

        if (existingCity) {
            this.customLoggerService.logAndThrow(
                ResponseMessagesEnum.CITY_ALREADY_EXISTS,
                method,
                BadRequestException,
            );
        }

        try {
            const location = this.locationsRepository.create({
                city,
                user_id,
            });
            return this.locationsRepository.save(location);
        } catch (error) {
            this.customLoggerService.handleError(error.messaage, method);
        }
    }

    async findAll(
        userId: string,
        paginationDto: PaginationDto,
    ): Promise<PaginatedResponse> {
        const method = this.findAll.name;

        let paginatedLocations: PaginatedResponse | null = null;

        try {
            paginatedLocations = await this.getPaginatedDataFromDb(
                userId,
                paginationDto,
            );
        } catch (error) {
            this.customLoggerService.logAndThrow(
                ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
                method,
                BadRequestException,
            );
        }

        this.customLoggerService.log(
            method,
            JSON.stringify(paginatedLocations),
        );

        return paginatedLocations;
    }

    async remove(id: string, userId: string): Promise<void> {
        const method = this.remove.name;
        const location = await this.locationsRepository.findOne({
            where: { id },
        });

        if (!location) {
            this.customLoggerService.logAndThrow(
                ResponseMessagesEnum.INVALID_ID,
                method,
                BadRequestException,
            );
            return;
        }

        if (location.user_id !== userId) {
            this.customLoggerService.logAndThrow(
                ResponseMessagesEnum.USER_PERMISSION_DENIED,
                method,
                ForbiddenException,
            );
        }
        try {
            await location.softRemove();

            this.customLoggerService.log(
                method,
                LogMessagesEnum.DB_DELETE_SUCCESS,
            );
        } catch (error) {
            this.customLoggerService.handleError(error.message, method);
        }
    }

    async findAllFavoriteLocations(): Promise<string[]> {
        const method = this.findAllFavoriteLocations.name;

        try {
            const locations = await this.locationsRepository.find();

            // remove duplicates
            const uniqueCities = [
                ...new Set(locations.map((location) => location.city)),
            ];

            this.customLoggerService.log(
                method,
                `Unique cities: ${JSON.stringify(uniqueCities)}`,
            );

            return uniqueCities;
        } catch (error) {
            this.customLoggerService.handleError(error.message, method);
        }
    }

    private async getPaginatedDataFromDb(
        userId: string,
        paginationDto: PaginationDto,
    ): Promise<PaginatedResponse> {
        const { page = 1, limit = 5 } = paginationDto;

        const offset = (page - 1) * limit;

        const [locations, total] = await this.locationsRepository.findAndCount({
            where: { user_id: userId },
            skip: offset,
            take: limit,
        });

        const paginatedLocations = createPaginatedResponse(
            locations,
            page,
            limit,
            total,
        );

        this.customLoggerService.log(
            this.getPaginatedDataFromDb.name,
            LogMessagesEnum.DB_READ_SUCCESS,
        );

        return paginatedLocations;
    }
}
