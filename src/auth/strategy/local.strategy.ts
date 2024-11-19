import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: "email" });
    }

    async validate(email: string, password: string, req: any): Promise<any> {
        let user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException(ResponseMessagesEnum.UNAUTHORIZED);
        }

        return user;
    }
}
