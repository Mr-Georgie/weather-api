import { Controller, Get, Param, Delete, Req, UseGuards } from "@nestjs/common";
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
import { createResponse } from "src/common/utils/general-utils";

@ApiTags("user")
@Controller("user")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("")
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "GET: logged in user account. Call after login/signup",
    })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.SUCCESS,
        type: User,
    })
    @ApiResponse({
        status: ResponseCodesEnum.UNAUTHORIZED,
        description: ResponseMessagesEnum.UNAUTHORIZED,
    })
    @ApiResponse({
        status: ResponseCodesEnum.NOT_FOUND,
        description: ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async getUser(@Req() req) {
        const id = req.user.userId;
        const user = await this.usersService.findUserById(id);

        return createResponse(
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.SUCCESS,
            user,
        );
    }

    @Get(":id")
    @ApiOperation({ summary: "GET: a user account by id" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.SUCCESS,
        type: User,
    })
    @ApiResponse({
        status: ResponseCodesEnum.NOT_FOUND,
        description: ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async findOne(@Param("id") id: string) {
        const user = await this.usersService.findUserById(id);

        return createResponse(
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.SUCCESS,
            user,
        );
    }

    @Delete(":id")
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "DELETE: a user account" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.SUCCESS,
    })
    @ApiResponse({
        status: ResponseCodesEnum.NOT_FOUND,
        description: ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async remove(@Req() req) {
        const userId = req.user.userId;
        await this.usersService.remove(userId);

        return createResponse(
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.SUCCESS,
        );
    }
}
