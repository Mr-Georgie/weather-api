import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { PasswordService } from "src/auth/password.service";
import { SignupUserDto } from "src/auth/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "src/database/entities/users.entity";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { LogMessagesEnum } from "src/common/enums/log-messages.enum";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService,
        private readonly customLoggerService: CustomLoggerService,
    ) {}

    async signup(signupUserDto: SignupUserDto): Promise<string> {
        const method = this.signup.name;

        await this.checkIfUserExists(signupUserDto.email);

        const hashedPassword = await this.passwordService.hashPassword(
            signupUserDto.password,
        );

        const user = await this.usersService.createUser(
            signupUserDto.email,
            hashedPassword,
        );

        this.customLoggerService.log(method, LogMessagesEnum.USER_CREATED);

        return this.generateToken(user);
    }

    async login(loginDto: LoginUserDto): Promise<string> {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        this.customLoggerService.log(
            this.login.name,
            LogMessagesEnum.AUTH_LOGIN_SUCCESS,
        );

        return this.generateToken(user);
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.findUser(email);
        return await this.matchPasswords(password, user);
    }

    async generateToken(user: User): Promise<string> {
        const payload = {
            email: user.email,
            sub: user.id,
        };

        const token = this.jwtService.sign(payload);

        this.customLoggerService.log(
            this.generateToken.name,
            LogMessagesEnum.AUTH_TOKEN_GENERATED,
        );

        return token;
    }

    private async matchPasswords(password: string, user: User): Promise<User> {
        const method = this.matchPasswords.name;

        const isMatch: boolean = await this.passwordService.comparePasswords(
            password,
            user.password_hash,
        );
        if (!isMatch) {
            this.customLoggerService.logAndThrow(
                ResponseMessagesEnum.PASSWORD_MISMATCH,
                this.matchPasswords.name,
                BadRequestException,
            );
        }

        const { password_hash: _, ...userWithoutPassword } = user;

        this.customLoggerService.log(method, LogMessagesEnum.PROCESS_COMPLETED);

        return userWithoutPassword as User;
    }

    private async checkIfUserExists(email: string): Promise<void> {
        await this.handleUserLookup(
            email,
            true, // isSignUp
            ResponseMessagesEnum.EMAIL_ALREADY_EXISTS,
        );
    }

    private async findUser(email: string): Promise<User> {
        return (await this.handleUserLookup(
            email,
            false, // isSignUp
            ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
        )) as User;
    }

    private async handleUserLookup(
        email: string,
        isSignUp: boolean,
        errorMessage: ResponseMessagesEnum,
    ): Promise<User | void> {
        const method = this.handleUserLookup.name;

        let user: User | null = null;

        try {
            user = await this.usersService.findUserByEmail(email, isSignUp);
        } catch (error) {
            this.customLoggerService.handleError(error, method);
        }

        const foundUserDuringSignUp = isSignUp && user;
        const noUserFoundDuringLogin = !isSignUp && !user;

        if (foundUserDuringSignUp || noUserFoundDuringLogin) {
            this.customLoggerService.logAndThrow(
                errorMessage,
                method,
                BadRequestException,
            );
        }

        return user || undefined; // Explicitly return undefined for `void`
    }
}
