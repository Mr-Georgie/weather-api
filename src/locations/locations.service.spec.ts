import { Test, TestingModule } from "@nestjs/testing";
import { LocationsService } from "./locations.service";
import { Repository } from "typeorm";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { CacheService } from "src/cache/cache.service";
import { Location } from "src/database/entities/locations.entity";
import {
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
} from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { LogMessagesEnum } from "src/common/enums/log-messages.enum";

describe("LocationsService", () => {
    let service: LocationsService;
    let locationsRepository: Repository<Location>;
    let customLoggerService: CustomLoggerService;

    const user_id = "user123";

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LocationsService,
                { provide: getRepositoryToken(Location), useClass: Repository },
                {
                    provide: CustomLoggerService,
                    useValue: {
                        logAndThrow: jest.fn(),
                        handleError: jest.fn(),
                        log: jest.fn(),
                    },
                },
                { provide: CacheService, useValue: {} }, // Mock CacheService if necessary
            ],
        }).compile();

        service = module.get<LocationsService>(LocationsService);
        locationsRepository = module.get<Repository<Location>>(
            getRepositoryToken(Location),
        );
        customLoggerService =
            module.get<CustomLoggerService>(CustomLoggerService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        const locationDto = { city: "new city" };
        const createdLocation = { id: "1", city: "new city", user_id };

        it("should create and save a new location", async () => {
            jest.spyOn(locationsRepository, "findOneBy").mockResolvedValue(
                null,
            );
            jest.spyOn(locationsRepository, "create").mockReturnValue(
                createdLocation as any,
            );
            jest.spyOn(locationsRepository, "save").mockResolvedValue(
                createdLocation as Location,
            );

            const result = await service.create(locationDto, user_id);

            expect(result).toEqual(createdLocation);
            expect(locationsRepository.create).toHaveBeenCalledWith({
                city: "new city",
                user_id,
            });
            expect(locationsRepository.save).toHaveBeenCalledWith(
                createdLocation,
            );
        });

        it("should throw BadRequestException if city already exists", async () => {
            const locationDto = { city: "existing city" };
            const existingLocation = {
                id: "1",
                city: "existing city",
                user_id,
            };

            jest.spyOn(locationsRepository, "findOneBy").mockResolvedValue(
                existingLocation as Location,
            );

            jest.spyOn(customLoggerService, "logAndThrow").mockImplementation(
                () => {
                    throw new BadRequestException(
                        ResponseMessagesEnum.CITY_ALREADY_EXISTS,
                    );
                },
            );

            await expect(service.create(locationDto, user_id)).rejects.toThrow(
                BadRequestException,
            );
            expect(customLoggerService.logAndThrow).toHaveBeenCalledWith(
                ResponseMessagesEnum.CITY_ALREADY_EXISTS,
                "create",
                BadRequestException,
            );
        });

        it("should handle error if save fails", async () => {
            jest.spyOn(locationsRepository, "findOneBy").mockResolvedValue(
                null,
            );
            jest.spyOn(locationsRepository, "save").mockRejectedValue(
                new Error("Database error"),
            );
            jest.spyOn(customLoggerService, "logAndThrow").mockImplementation(
                () => {
                    throw new InternalServerErrorException(
                        ResponseMessagesEnum.SERVER_ERROR,
                    );
                },
            );
            jest.spyOn(locationsRepository, "save").mockRejectedValue(
                new InternalServerErrorException(
                    ResponseMessagesEnum.SERVER_ERROR,
                ),
            );

            await service.create(locationDto, user_id);

            expect(customLoggerService.handleError).toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        const locationId = "existent";
        const location = {
            id: locationId,
            city: "test city",
            user_id,
            softRemove: jest.fn(),
        };
        it("should remove location if user has permission", async () => {
            jest.spyOn(locationsRepository, "findOne").mockResolvedValue(
                location as unknown as Location,
            );

            await service.remove(locationId, user_id);

            expect(location.softRemove).toHaveBeenCalled();
            expect(customLoggerService.log).toHaveBeenCalledWith(
                "remove",
                LogMessagesEnum.DB_DELETE_SUCCESS,
            );
        });

        it("should throw BadRequestException if location not found", async () => {
            const locationId = "nonexistent-id";

            jest.spyOn(locationsRepository, "findOne").mockResolvedValue(null);
            jest.spyOn(customLoggerService, "logAndThrow").mockImplementation(
                () => {
                    throw new BadRequestException(
                        ResponseMessagesEnum.INVALID_ID,
                    );
                },
            );

            await expect(service.remove(locationId, user_id)).rejects.toThrow(
                BadRequestException,
            );
            expect(customLoggerService.logAndThrow).toHaveBeenCalledWith(
                ResponseMessagesEnum.INVALID_ID,
                "remove",
                BadRequestException,
            );
        });

        it("should throw ForbiddenException if user is not authorized", async () => {
            const locationId = "someLocationId";
            const userId = "authorizedUserId";
            const otherUserId = "unauthorizedUserId";

            // Mock findOne to return a location owned by a different user
            jest.spyOn(locationsRepository, "findOne").mockResolvedValue({
                id: locationId,
                user_id: userId,
                softRemove: jest.fn(),
            } as any);

            jest.spyOn(customLoggerService, "logAndThrow").mockImplementation(
                () => {
                    throw new ForbiddenException();
                },
            );

            // Test
            await expect(
                service.remove(locationId, otherUserId),
            ).rejects.toThrow(ForbiddenException);
            expect(customLoggerService.logAndThrow).toHaveBeenCalledWith(
                ResponseMessagesEnum.USER_PERMISSION_DENIED,
                "remove",
                ForbiddenException,
            );
        });
    });

    describe("findAllFavoriteLocations", () => {
        it("should return unique cities from all locations", async () => {
            const locations = [
                { id: "1", city: "city1" },
                { id: "2", city: "city1" },
                { id: "3", city: "city2" },
            ];

            jest.spyOn(locationsRepository, "find").mockResolvedValue(
                locations as Location[],
            );

            const result = await service.findAllFavoriteLocations();

            expect(result).toEqual(["city1", "city2"]);
            expect(customLoggerService.log).toHaveBeenCalledWith(
                "findAllFavoriteLocations",
                `Unique cities: ${JSON.stringify(["city1", "city2"])}`,
            );
        });

        it("should handle error if find fails", async () => {
            jest.spyOn(locationsRepository, "find").mockRejectedValue(
                new Error(LogMessagesEnum.DB_READ_FAILURE),
            );

            await service.findAllFavoriteLocations();

            expect(customLoggerService.handleError).toHaveBeenCalled();
        });
    });
});
