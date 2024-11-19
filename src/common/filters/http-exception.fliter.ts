import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
} from "@nestjs/common";
import { Response } from "express";
import { createResponse } from "../utils/custom-api-response.utils";
import { ResponseMessagesEnum } from "../enums/response-messages.enum";
import { StatusEnum } from "../enums/status.enum";
import { getErrorCode } from "../utils/general.utils";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        let [_, errorMessage] = getErrorCode(status);

        const message = exception.getResponse()["message"] || errorMessage;
        const stack = exception.message;

        this.logger.error(`STATUS [${status}] - MESSAGE [${message}]`, stack);

        response
            .status(status)
            .json(createResponse(StatusEnum.ERROR, status, message));
    }
}
