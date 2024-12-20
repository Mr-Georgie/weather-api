import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
    constructor(private authService: AuthService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { email, password, userType } = request.body;

        let user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException(ResponseMessagesEnum.UNAUTHORIZED);
        }

        request.user = user;
        return true;
    }
}
