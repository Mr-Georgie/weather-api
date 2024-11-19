import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CacheService } from "src/cache/cache.service";
import { LogMessagesEnum } from "src/common/enums/log-messages.enum";
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
        private readonly cacheService: CacheService,
    ) {}

    async createUser(email: string, password: string): Promise<User> {
        const method = this.createUser.name;
        let createdUser: User | null = null;

        try {
            const user = this.usersRepository.create({
                email,
                password_hash: password,
            });

            createdUser = await this.usersRepository.save(user);
        } catch (error) {
            this.customLoggerService.handleError(error, method);
        }

        this.customLoggerService.log(method, LogMessagesEnum.DB_CREATE_SUCCESS);

        return createdUser;
    }

    async findUserByEmail(
        email: string,
        isSignUp: boolean,
    ): Promise<User | null> {
        let user: User | null = null;
        const method = this.findUserByEmail.name;

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

        this.customLoggerService.log(method, LogMessagesEnum.DB_READ_SUCCESS);

        return user;
    }

    async findUserById(id: string): Promise<User> {
        const method = this.findUserById.name;
        const cacheKey = `user:${id}`;

        let user: User | null = null;

        // handle error here as this would likely be called by controllers
        try {
            user = await this.fetchUserFromCache(cacheKey);

            if (!user) {
                user = await this.fetchUserFromDb(id, cacheKey);
            }
        } catch (error) {
            this.customLoggerService.logAndThrow(
                ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
                method,
                BadRequestException,
            );
        }

        return user;
    }

    async remove(userId: string): Promise<void> {
        const method = this.remove.name;
        const user = await this.findUserById(userId);

        try {
            await user.softRemove();
            this.customLoggerService.log(
                method,
                LogMessagesEnum.DB_DELETE_SUCCESS,
            );
        } catch (error) {
            this.customLoggerService.handleError(error, method);
        }
    }

    private async fetchUserFromCache(
        cacheKey: string,
    ): Promise<User> {
        // const cachedUser = await this.cacheService.get<User>(cacheKey);
        const cachedUser = await this.cacheService.get<User>(cacheKey);

        if (cachedUser) {
            this.customLoggerService.log(
                this.fetchUserFromCache.name,
                LogMessagesEnum.CACHE_READ_SUCCESS,
            );
            return cachedUser;
        }
    }

    private async fetchUserFromDb(id: string, cacheKey: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
        });

        this.customLoggerService.log(
            this.fetchUserFromDb.name,
            LogMessagesEnum.DB_READ_SUCCESS,
        );

        const { password_hash: _, ...userWithoutPassword } = user;

        // Store in cache only if user is found
        await this.cacheService.set(
            cacheKey,
            userWithoutPassword as User,
            30000,
        );

        return userWithoutPassword as User;
    }
}
