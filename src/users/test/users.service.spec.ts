import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users.service";
import { CacheService } from "src/cache/cache.service";
import { User } from "src/database/entities/users.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { Not } from "typeorm";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { BadRequestException } from "@nestjs/common";

describe("UsersService", () => {
    let service: UsersService;
    let cacheService: CacheService;
    let customLoggerService: CustomLoggerService;
    let usersRepository: any;

    const testEmail = "test@mail.com";

    const mockUser = {
        id: "some-user-id",
        email: testEmail,
        password_hash: "password123",
        created_at: "2024-11-15T12:55:19.631Z",
        updated_at: "2024-11-15T12:55:19.631Z",
        deleted_at: null,
    };

    const mockDeletedUser = {
        id: "some-user-id",
        email: testEmail,
        password_hash: "password123",
        created_at: "2024-11-15T12:55:19.631Z",
        updated_at: "2024-11-15T12:55:19.631Z",
        deleted_at: "2024-11-16T12:55:19.631Z",
    };

    const mockUserRepository = {
        findOne: jest.fn(),
    };

    const mockCacheService = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    };

    const mockCustomLoggerService = {
        log: jest.fn(),
        logAndThrow: jest.fn(),
        handleError: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                { provide: CacheService, useValue: mockCacheService },
                {
                    provide: CustomLoggerService,
                    useValue: mockCustomLoggerService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        cacheService = module.get<CacheService>(CacheService);
        customLoggerService =
            module.get<CustomLoggerService>(CustomLoggerService);
        usersRepository = module.get(getRepositoryToken(User));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findUserByEmail", () => {
        it("should return a soft_deleted record if isSignUp is true", async () => {
            usersRepository.findOne.mockResolvedValue(mockDeletedUser);

            const result = await service.findUserByEmail(testEmail, true);

            expect(result).toEqual(mockDeletedUser);
            expect(usersRepository.findOne).toHaveBeenCalledWith({
                where: [
                    { email: testEmail, deleted_at: null },
                    { email: testEmail, deleted_at: Not(null) },
                ],
                withDeleted: true,
            });
        });

        it("should return a non-deleted record if isSignUp is false", async () => {
            usersRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findUserByEmail(testEmail, false);

            expect(result).toEqual(mockUser);
            expect(usersRepository.findOne).toHaveBeenCalledWith({
                where: {
                    email: testEmail,
                },
            });
        });
    });

    describe("findUserById", () => {
        const cacheKey = `user:${mockUser.id}`;
        it("should return a user from the cache if found", async () => {
            const mockCacheUser = mockUser as unknown as User;
            jest.spyOn(cacheService, "get").mockResolvedValue(mockCacheUser);

            const result = await service.findUserById("some-user-id");

            expect(result).toEqual(mockUser);
            expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
            expect(customLoggerService.log).toHaveBeenCalled();
        });

        it("should fetch a user from the database if not found in the cache", async () => {
            const { password_hash: _, ...userWithoutPassword } = mockUser;

            jest.spyOn(cacheService, "get").mockResolvedValue(null);
            jest.spyOn(usersRepository, "findOne").mockResolvedValue(mockUser);
            jest.spyOn(cacheService, "set").mockResolvedValue(undefined);

            const result = await service.findUserById(mockUser.id);

            expect(result).toEqual(userWithoutPassword);
            expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
            expect(usersRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockUser.id },
            });
            expect(cacheService.set).toHaveBeenCalledWith(
                cacheKey,
                userWithoutPassword,
                30000,
            );
            expect(customLoggerService.log).toHaveBeenCalled();
        });

        it("should throw an error if the user is not found in the database", async () => {
            jest.spyOn(cacheService, "get").mockResolvedValue(null);
            jest.spyOn(usersRepository, "findOne").mockResolvedValue(null);
            jest.spyOn(customLoggerService, "logAndThrow").mockImplementation(
                () => {
                    throw new BadRequestException(
                        ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
                    );
                },
            );

            await expect(service.findUserById(mockUser.id)).rejects.toThrow(
                BadRequestException,
            );
            expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
            expect(usersRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockUser.id },
            });
            expect(customLoggerService.logAndThrow).toHaveBeenCalled();
        });
    });
});
