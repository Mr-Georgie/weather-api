import {
    Controller,
    Get,
    Param,
    Delete,
    Req,
    UseGuards,
    UseFilters,
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { User } from "../database/entities/users.entity";
import { JwtAuthGuard } from "src/auth/security/jwt-auth.guard";
import { ResponseCodesEnum } from "src/common/enums/response-codes.enum";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { createResponse } from "src/common/utils/custom-api-response.utils";
import { HttpExceptionFilter } from "src/common/filters/http-exception.fliter";
import { StatusEnum } from "src/common/enums/status.enum";
import { ErrorResponse, SuccessResponse } from "src/common/dto/response.dto";
import {
    INTERNAL_SERVER_ERROR,
    RATE_LIMIT_EXAMPLE,
    UNAUTHORIZED_EXAMPLE,
} from "src/common/dto/swagger-examples";
import { Throttle } from "@nestjs/throttler";
import { RestThrottlerGuard } from "src/throttler/rest-throttler-guard";
import { RATE_LIMITS } from "src/throttler/rate-limit.config";

@ApiTags("user")
@Controller("user")
@UseFilters(HttpExceptionFilter)
@UseGuards(RestThrottlerGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(RestThrottlerGuard)
    @Throttle({ default: RATE_LIMITS.AUTHENTICATED })
    @Get("")
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "GET: logged in user account. Call after login/signup",
        description:
            "Fetch details of logged in user account. Call after login/signup",
    })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.SUCCESS,
        type: SuccessResponse,
        examples: {
            success: {
                summary: "Get User Success Example",
                value: {
                    status: StatusEnum.SUCCESS,
                    statusCode: ResponseCodesEnum.SUCCESS,
                    message: ResponseMessagesEnum.SUCCESS,
                    data: {
                        id: "9c95decd-xxxx-xxxx-xxxx-fed03a29fec5",
                        email: "xx@exxx.com",
                        created_at: "2024-11-18T16:55:05.783Z",
                        updated_at: "2024-11-18T16:55:05.783Z",
                        deleted_at: null,
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: ResponseCodesEnum.UNAUTHORIZED,
        description: ResponseMessagesEnum.UNAUTHORIZED,
        type: SuccessResponse,
        examples: {
            success: UNAUTHORIZED_EXAMPLE,
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
    async getUser(@Req() req) {
        const id = req.user.id;
        const user = await this.usersService.findUserById(id);

        return createResponse(
            StatusEnum.SUCCESS,
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.SUCCESS,
            user,
        );
    }
}
