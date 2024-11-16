import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { PasswordService } from "src/common/services/password.service";
import { SignupUserDto } from "src/auth/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "src/database/entities/users.entity";
import { CustomLoggerService } from "src/common/services/custom-logger.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService,
        private readonly customLoggerService: CustomLoggerService,
    ) {}

    async signup(signupUserDto: SignupUserDto): Promise<string> {
        const action = "signup";

        await this.checkForExistingUser(signupUserDto.email, action);

        const hashedPassword = await this.passwordService.hashPassword(
            signupUserDto.password,
        );

        const user = await this.usersService.createUser(
            signupUserDto.email,
            hashedPassword,
        );

        this.customLoggerService.log(
            action,
            ResponseMessagesEnum.RECORD_CREATED,
        );

        return this.generateToken(user);
    }

    async login(loginDto: LoginUserDto): Promise<string> {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        this.customLoggerService.log("login", "About to generate token");

        return this.generateToken(user);
    }

    async validateUser(email: string, password: string): Promise<User> {
        const action = "validateUser";

        let user: User | null = null;

        // handle error here because its not handled in the user service method
        try {
            user = await this.usersService.findUserByEmail(
                email,
                false, // !isSignUp
            );
        } catch (error) {
            this.customLoggerService.handleError(error, action);
        }

        if (!user) {
            this.customLoggerService.logAndThrow(
                ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
                action,
                BadRequestException,
            );
        }
        const isMatch: boolean = await this.passwordService.comparePasswords(
            password,
            user.password,
        );
        if (!isMatch) {
            this.customLoggerService.logAndThrow(
                ResponseMessagesEnum.PASSWORD_MISMATCH,
                action,
                BadRequestException,
            );
        }

        const { password: _, ...userWithoutPassword } = user;

        this.customLoggerService.log(
            action,
            ResponseMessagesEnum.PROCESS_COMPLETED,
        );

        return userWithoutPassword as User;
    }

    async generateToken(user: User): Promise<string> {
        const payload = {
            email: user.email,
            sub: user.id,
        };

        const token = this.jwtService.sign(payload);

        this.customLoggerService.log(
            "generateToken",
            ResponseMessagesEnum.PROCESS_COMPLETED,
        );

        return token;
    }

    async checkForExistingUser(email: string, action: string): Promise<void> {
        let existingUser: User | null = null;

        // handle error here because its not handled in the user service method
        try {
            existingUser = await this.usersService.findUserByEmail(
                email,
                true, // isSignup
            );
        } catch (error) {
            this.customLoggerService.handleError(error, action);
        }

        if (existingUser) {
            this.customLoggerService.logAndThrow(
                ResponseMessagesEnum.EMAIL_ALREADY_EXISTS,
                action,
                BadRequestException,
            );
        }
    }
}
