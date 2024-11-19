import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw (
                err ||
                new UnauthorizedException(ResponseMessagesEnum.UNAUTHORIZED)
            );
        }
        return user;
    }
}
