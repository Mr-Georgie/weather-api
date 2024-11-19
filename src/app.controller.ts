import { Controller, Get, UseFilters, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { RestThrottlerGuard } from "./throttler/rest-throttler-guard";
import { HttpExceptionFilter } from "./common/filters/http-exception.fliter";
import { RATE_LIMITS } from "./throttler/rate-limit.config";
import { ResponseCodesEnum } from "./common/enums/response-codes.enum";
import { ResponseMessagesEnum } from "./common/enums/response-messages.enum";
import { ErrorResponse, SuccessResponse } from "./common/dto/response.dto";
import { RATE_LIMIT_EXAMPLE } from "./common/dto/swagger-examples";
import {
    createResponse,
    CustomApiResponse,
} from "./common/utils/custom-api-response.utils";
import { StatusEnum } from "./common/enums/status.enum";

@ApiTags("ping")
@Controller("/ping")
@UseFilters(HttpExceptionFilter)
@UseGuards(RestThrottlerGuard)
export class AppController {
    constructor(private readonly appService: AppService) {}

    @UseGuards(RestThrottlerGuard)
    @Throttle({ default: RATE_LIMITS.PUBLIC })
    @Get()
    @ApiOperation({
        summary: "Ping",
        description:
            "Use this endpoint to confirm if server is down. Returns `Hello World!`",
    })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.SUCCESS,
        type: SuccessResponse,
        examples: {
            success: {
                summary: "Say hello",
                value: {
                    status: StatusEnum.SUCCESS,
                    statusCode: ResponseCodesEnum.SUCCESS,
                    message: "Hello World!",
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
    getHello(): CustomApiResponse {
        const helloMessage = this.appService.getHello();

        return createResponse(
            StatusEnum.SUCCESS,
            ResponseCodesEnum.SUCCESS,
            helloMessage,
        );
    }
}
