import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { ResponseMessagesEnum } from 'src/common/enums/response-messages.enum';
import { ResponseCodesEnum } from 'src/common/enums/response-codes.enum';
import { AppConfigService } from 'src/common/services/app-config.service';
import { AuthService } from './auth.service';
import { createResponse } from 'src/common/utils/general-utils';
import { SignupUserDto } from './dto/create-user.dto';

@ApiTags('authenication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private appConfigService: AppConfigService,
    ) {}

    @Post('signup')
    @ApiOperation({ summary: 'Signup' })
    @ApiBody({ type: SignupUserDto })
    @ApiResponse({
        status: ResponseCodesEnum.CREATED,
        description: ResponseMessagesEnum.SIGNUP_SUCCESS,
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.EMAIL_ALREADY_EXISTS,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async signup(
        @Res({ passthrough: true }) response: Response,
        @Body() signupUserDto: SignupUserDto,
    ) {
        const access_token = await this.authService.signup(signupUserDto);

        const expiresIn = this.appConfigService.getTokenExpirationTime();

        response.cookie('token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: expiresIn, // 1 hour
            path: '/',
        });

        return createResponse(
            ResponseCodesEnum.CREATED,
            ResponseMessagesEnum.SIGNUP_SUCCESS,
        );
    }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.LOGIN_SUCCESS,
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.EMAIL_NOT_FOUND,
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.INVALID_DETAILS,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async login(
        @Res({ passthrough: true }) response: Response,
        @Body() loginDto: LoginUserDto,
    ) {
        const access_token = await this.authService.login(loginDto);

        const expiresIn = this.appConfigService.getTokenExpirationTime();

        response.cookie('token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: expiresIn, // 1 hour
            path: '/',
        });

        return createResponse(
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.LOGIN_SUCCESS,
        );
    }
}
