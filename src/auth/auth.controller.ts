import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Res,
    UseFilters,
    UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginUserDto } from "./dto/login-user.dto";
import { Response } from "express";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { ResponseCodesEnum } from "src/common/enums/response-codes.enum";
import { AppConfigService } from "src/app-config/app-config.service";
import { AuthService } from "./auth.service";
import { createResponse } from "src/common/utils/custom-api-response.utils";
import { SignupUserDto } from "./dto/create-user.dto";
import { HttpExceptionFilter } from "src/common/filters/http-exception.fliter";
import { StatusEnum } from "src/common/enums/status.enum";
import { ErrorResponse, SuccessResponse } from "src/common/dto/response.dto";
import {
    BAD_REQUEST_EMAIL,
    BAD_REQUEST_PASSWORD,
    INTERNAL_SERVER_ERROR,
    RATE_LIMIT_EXAMPLE,
    SUCCESS_EXAMPLE,
} from "src/common/dto/swagger-examples";
import { Throttle } from "@nestjs/throttler";
import { RestThrottlerGuard } from "src/throttler/rest-throttler-guard";
import { RATE_LIMITS } from "src/throttler/rate-limit.config";

@ApiTags("authenication")
@Controller("auth")
@UseFilters(HttpExceptionFilter)
@UseGuards(RestThrottlerGuard)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private appConfigService: AppConfigService,
    ) {}

    @UseGuards(RestThrottlerGuard)
    @Throttle({ default: RATE_LIMITS.PUBLIC })
    @Post("signup")
    /**
     * User login endpoint
     * @security Recommended to use HTTP-only cookies in production
     * @note Token returned directly for development/testing purposes
     */
    @ApiOperation({
        summary: "Signup",
        description:
            "Security Note: In production, implement token storage using HTTP-only cookies to mitigate XSS risks. Current implementation returns token directly for testing/development purposes.",
    })
    @ApiBody({ type: SignupUserDto })
    @ApiResponse({
        status: ResponseCodesEnum.CREATED,
        description: ResponseMessagesEnum.SIGNUP_SUCCESS,
        type: SuccessResponse,
        examples: {
            success: {
                summary: "Signup Example",
                value: {
                    status: StatusEnum.SUCCESS,
                    statusCode: ResponseCodesEnum.CREATED,
                    message: ResponseMessagesEnum.SIGNUP_SUCCESS,
                    data: {
                        token: "eyJhbGciOiJIUzI1NiIsCYyyfGJ1eUkIWRCo.....",
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.EMAIL_ALREADY_EXISTS,
        type: ErrorResponse,
        examples: { success: BAD_REQUEST_EMAIL },
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.PASSWORD_WEAK,
        type: ErrorResponse,
        examples: { success: BAD_REQUEST_PASSWORD },
    })
    @ApiResponse({
        status: ResponseCodesEnum.TOO_MANY_REQUEST,
        description: ResponseMessagesEnum.TOO_MANY_REQUEST,
        type: ErrorResponse,
        examples: { success: RATE_LIMIT_EXAMPLE },
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
        type: ErrorResponse,
        examples: { success: INTERNAL_SERVER_ERROR },
    })
    async signup(
        @Res({ passthrough: true }) response: Response,
        @Body() signupUserDto: SignupUserDto,
    ) {
        const access_token = await this.authService.signup(signupUserDto);

        return createResponse(
            StatusEnum.SUCCESS,
            ResponseCodesEnum.CREATED,
            ResponseMessagesEnum.SIGNUP_SUCCESS,
            {
                token: access_token,
            },
        );
    }

    @UseGuards(RestThrottlerGuard)
    @Throttle({ default: RATE_LIMITS.PUBLIC })
    @Post("login")
    /**
     * User login endpoint
     * @security Recommended to use HTTP-only cookies in production
     * @note Token returned directly for development/testing purposes
     */
    @ApiOperation({
        summary: "Login",
        description:
            "Security Note: In production, implement token storage using HTTP-only cookies to mitigate XSS risks. Current implementation returns token directly for testing/development purposes.",
    })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({
        status: ResponseCodesEnum.CREATED,
        description: ResponseMessagesEnum.LOGIN_SUCCESS,
        type: SuccessResponse,
        examples: {
            success: {
                summary: "Login Example",
                value: {
                    status: StatusEnum.SUCCESS,
                    statusCode: ResponseCodesEnum.CREATED,
                    message: ResponseMessagesEnum.LOGIN_SUCCESS,
                    data: {
                        token: "eyJhbGciOiJIUzI1NiIsCYyyfGJ1eUkIWRCo.....",
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.EMAIL_NOT_FOUND,
        type: ErrorResponse,
        examples: {
            success: {
                summary: "Bad Request Error Example",
                value: {
                    status: StatusEnum.ERROR,
                    statusCode: ResponseCodesEnum.BAD_REQUEST,
                    message: ResponseMessagesEnum.EMAIL_NOT_FOUND,
                },
            },
        },
    })
    @ApiResponse({
        status: ResponseCodesEnum.TOO_MANY_REQUEST,
        description: ResponseMessagesEnum.TOO_MANY_REQUEST,
        type: ErrorResponse,
        examples: { success: RATE_LIMIT_EXAMPLE },
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
        type: ErrorResponse,
        examples: { success: INTERNAL_SERVER_ERROR },
    })
    async login(
        @Res({ passthrough: true }) response: Response,
        @Body() loginDto: LoginUserDto,
    ) {
        const access_token = await this.authService.login(loginDto);

        return createResponse(
            StatusEnum.SUCCESS,
            ResponseCodesEnum.CREATED,
            ResponseMessagesEnum.LOGIN_SUCCESS,
            {
                token: access_token,
            },
        );
    }
}
