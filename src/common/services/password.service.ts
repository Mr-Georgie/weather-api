import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { AppConfigService } from "src/app-config/app-config.service";

@Injectable()
export class PasswordService {
    constructor(private appConfigService: AppConfigService) {}

    async hashPassword(password: string): Promise<string> {
        const saltRounds = this.appConfigService.getBcryptSaltRounds();
        return bcrypt.hash(password, saltRounds);
    }

    async comparePasswords(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, hashedPassword);
    }
}
