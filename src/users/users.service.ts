import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CacheService } from "src/cache/cache.service";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { User } from "src/database/entities/users.entity";
import { Not, Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly customLoggerService: CustomLoggerService,
        private readonly cacheService: CacheService<User>,
    ) {}

    async createUser(email: string, password: string): Promise<User> {
        const action = "createUser";
        try {
            const user = this.usersRepository.create({
                email,
                password,
            });

            this.customLoggerService.log(
                action,
                ResponseMessagesEnum.PROCESS_COMPLETED,
            );

            return this.usersRepository.save(user);
        } catch (error) {
            this.customLoggerService.handleError(error, action);
        }
    }

    async findUserByEmail(
        email: string,
        isSignUp: boolean,
    ): Promise<User | null> {
        let user: User | null = null;
        const action = "findUserByEmail";

        if (isSignUp) {
            user = await this.usersRepository.findOne({
                where: [
                    { email, deleted_at: null }, // Active record
                    { email, deleted_at: Not(null) }, // Soft-deleted record
                ],
                withDeleted: true, // Include soft-deleted records
            });
        } else {
            user = await this.usersRepository.findOne({
                where: { email },
            });
        }

        this.customLoggerService.log(
            action,
            ResponseMessagesEnum.PROCESS_COMPLETED,
        );

        return user;
    }

    async findUserById(id: string): Promise<User> {
        const action = "findUserById";
        const cacheKey = `user:${id}`;

        // const cachedUser = await this.cacheService.get<User>(cacheKey);
        const cachedUser = await this.cacheService.get(cacheKey);

        if (cachedUser) {
            this.customLoggerService.log(action, "gotten from cache");
            return cachedUser;
        }

        // handle error here as this would like be called by controllers
        try {
            const user = await this.usersRepository.findOne({
                where: { id },
            });

            this.customLoggerService.log(
                action,
                ResponseMessagesEnum.PROCESS_COMPLETED,
            );

            const { password: _, ...userWithoutPassword } = user;

            // Store in cache only if user is found
            await this.cacheService.set(
                cacheKey,
                userWithoutPassword as User,
                30000,
            );

            return userWithoutPassword as User;
        } catch (error) {
            this.customLoggerService.logAndThrow(
                ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
                action,
                BadRequestException,
            );
        }
    }

    async remove(userId: string): Promise<void> {
        const action = "remove";
        const user = await this.findUserById(userId);

        try {
            await user.softRemove();
            this.customLoggerService.log(
                action,
                ResponseMessagesEnum.PROCESS_COMPLETED,
            );
        } catch (error) {
            this.customLoggerService.handleError(error, action);
        }
    }
}
