import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users.service";
import { CacheService } from "src/cache/cache.service";
import { User } from "src/database/entities/users.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { Not } from "typeorm";

describe("UsersService", () => {
    let service: UsersService;
    let cacheService: CacheService<User>;
    let customLoggerService: CustomLoggerService;
    let usersRepository: any;

    const testEmail = "test@mail.com";

    const mockUser = {
        id: "user-id",
        email: testEmail,
        password: "password123",
        created_at: "2024-11-15T12:55:19.631Z",
        updated_at: "2024-11-15T12:55:19.631Z",
        deleted_at: null,
    };

    const mockDeletedUser = {
        id: "user-id",
        email: testEmail,
        password: "password123",
        created_at: "2024-11-15T12:55:19.631Z",
        updated_at: "2024-11-15T12:55:19.631Z",
        deleted_at: "2024-11-16T12:55:19.631Z",
    };

    const mockUserRepository = {
        findOne: jest.fn(),
    };

    const mockCacheService = {
        findOne: jest.fn(),
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
        cacheService = module.get<CacheService<User>>(CacheService);
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
});
