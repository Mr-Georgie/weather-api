import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AppConfigService } from "src/app-config/app-config.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly appConfigService: AppConfigService) {
        super({
            jwtFromRequest: (req) => {
                // Extract JWT from Authorization header
                const headerToken =
                    ExtractJwt.fromAuthHeaderAsBearerToken()(req);
                // Extract JWT from cookie
                const cookieToken = req?.cookies?.token; // cookie is named 'token'
                // Prefer header token over cookie token, or return cookie token if header token doesn't exist
                return headerToken || cookieToken;
            },
            ignoreExpiration: false,
            secretOrKey: appConfigService.getJwtSecret(),
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            email: payload.email,
        };
    }
}
