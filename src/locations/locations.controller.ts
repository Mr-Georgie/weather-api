import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    Req,
    UseFilters,
    UseGuards,
} from "@nestjs/common";
import { LocationsService } from "./locations.service";
import { IdParamDto, LocationDto } from "./dto/locations.dto";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/security/jwt-auth.guard";
import { ResponseCodesEnum } from "src/common/enums/response-codes.enum";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import {
    createResponse,
    CustomApiResponse,
} from "src/common/utils/custom-api-response.utils";
import { HttpExceptionFilter } from "src/common/filters/http-exception.fliter";
import { StatusEnum } from "src/common/enums/status.enum";
import { ErrorResponse, SuccessResponse } from "src/common/dto/response.dto";
import {
    BAD_REQUEST_CITY,
    INTERNAL_SERVER_ERROR,
    RATE_LIMIT_EXAMPLE,
    SUCCESS_EXAMPLE,
    UNAUTHORIZED_EXAMPLE,
} from "src/common/dto/swagger-examples";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { Throttle } from "@nestjs/throttler";
import { RestThrottlerGuard } from "src/throttler/rest-throttler-guard";
import { RATE_LIMITS } from "src/throttler/rate-limit.config";

@Controller("locations")
@UseFilters(HttpExceptionFilter)
@UseGuards(RestThrottlerGuard)
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @UseGuards(RestThrottlerGuard)
    @Throttle({ default: RATE_LIMITS.AUTHENTICATED })
    @Post()
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Add a location to the user's favorites",
        description: "Add a location to the user's favorites",
    })
    @ApiResponse({
        status: ResponseCodesEnum.CREATED,
        description: ResponseMessagesEnum.CREATED,
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
                        city: "new yorkat",
                        user_id: "9c95decd-fefa-4fb2-9ce8-fed03a29fec5",
                        created_at: "2024-11-18T17:14:41.299Z",
                        updated_at: "2024-11-18T17:14:41.299Z",
                        deleted_at: null,
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.BAD_REQUEST,
        type: ErrorResponse,
        examples: { success: BAD_REQUEST_CITY },
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
    async create(
        @Req() req,
        @Body() locationDto: LocationDto,
    ): Promise<CustomApiResponse> {
        const userId = req.user.id;
        const location = await this.locationsService.create(
            locationDto,
            userId,
        );

        return createResponse(
            StatusEnum.SUCCESS,
            ResponseCodesEnum.CREATED,
            ResponseMessagesEnum.SUCCESS,
            location,
        );
    }

    @UseGuards(RestThrottlerGuard)
    @Throttle({ default: RATE_LIMITS.AUTHENTICATED })
    @Get()
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Retrieve the user's favorite locations",
        description: "Retrieve the user's favorite locations",
    })
    @ApiQuery({
        name: "page",
        required: false,
        type: Number,
        description: "Page number for pagination",
    })
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        description: "Page size for pagination",
    })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.SUCCESS,
        type: SuccessResponse,
        examples: {
            success: {
                summary: "Get Favorite Locations Example",
                value: {
                    status: StatusEnum.SUCCESS,
                    statusCode: ResponseCodesEnum.SUCCESS,
                    message: ResponseMessagesEnum.SUCCESS,
                    data: {
                        results: [
                            {
                                id: "75e600b7-3ea2-4caf-8d64-01abc1e2648d",
                                city: "new",
                                user_id: "184fe122-e279-4eb2-966a-09da5e3a83e0",
                                created_at: "2024-11-18T15:41:03.336Z",
                                updated_at: "2024-11-18T15:41:03.336Z",
                                deleted_at: null,
                            },
                        ],
                    },
                    currentPage: 1,
                    pageSize: 1,
                    totalPages: 1,
                    totalItems: 1,
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
    async findAll(
        @Req() req,
        @Query() paginationDto: PaginationDto,
    ): Promise<CustomApiResponse> {
        const userId = req.user.id;
        const locations = await this.locationsService.findAll(
            userId,
            paginationDto,
        );

        return createResponse(
            StatusEnum.SUCCESS,
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.SUCCESS,
            locations,
        );
    }

    @UseGuards(RestThrottlerGuard)
    @Throttle({ default: RATE_LIMITS.AUTHENTICATED })
    @Delete(":id")
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Remove a location from favorites",
        description: "Remove a location from favorites",
    })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.SUCCESS,
        type: SuccessResponse,
        examples: { success: SUCCESS_EXAMPLE },
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.INVALID_ID,
        type: ErrorResponse,
        examples: { success: BAD_REQUEST_CITY },
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
    async remove(
        @Req() req,
        @Param(
            "id",
            new ParseUUIDPipe({
                version: "4",
                errorHttpStatusCode: 400,
                exceptionFactory: (error) => {
                    return new BadRequestException(
                        ResponseMessagesEnum.INVALID_UUID,
                    );
                },
            }),
        )
        id: string,
    ): Promise<CustomApiResponse> {
        const userId = req.user.id;
        await this.locationsService.remove(id, userId);

        return createResponse(
            StatusEnum.SUCCESS,
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.SUCCESS,
        );
    }
}
