import { Test, TestingModule } from "@nestjs/testing";
import { JwtAuthGuard } from "src/auth/security/jwt-auth.guard";
import { ResponseCodesEnum } from "src/common/enums/response-codes.enum";
import { createPaginatedResponse } from "src/common/utils/paginated-response.utils";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { LoginUserDto } from "src/auth/dto/login-user.dto";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/database/entities/users.entity";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { UnauthorizedException } from "@nestjs/common";

describe("UsersController", () => {
    let controller: UsersController;
    let usersService: UsersService;

    const loginDto: LoginUserDto = {
        email: "test@example.com",
        password: "password123",
    };

    const mockUser = {
        id: "user-id",
        email: loginDto.email,
        password: "password123",
        created_at: "2024-11-15T12:55:19.631Z",
        updated_at: "2024-11-15T12:55:19.631Z",
        deleted_at: null,
    };

    const mockUserService = {
        createUser: jest.fn(),
        findUserByEmail: jest.fn(),
        findUserById: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUser,
                },
                {
                    provide: UsersService,
                    useValue: mockUserService,
                },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined(); // Test the controller
    });

    describe("getUser", () => {
        const req = { user: { userId: "some-user-id" } };

        it("should return details of the current logged in user", async () => {
            jest.spyOn(usersService, "findUserById").mockResolvedValue(
                mockUser as unknown as User,
            );

            const result = await controller.getUser(req);
            expect(result.statusCode).toBe(ResponseCodesEnum.SUCCESS);
            expect(result.data).toBe(mockUser);
        });
    });
});
