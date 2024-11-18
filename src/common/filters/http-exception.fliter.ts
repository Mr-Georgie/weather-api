import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
} from "@nestjs/common";
import { Response } from "express";
import { createResponse } from "../utils/general-utils";
import { ResponseMessagesEnum } from "../enums/response-messages.enum";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        if (host.getType() === "http") {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const status = exception.getStatus();
            const message =
                exception.getResponse()["message"] ||
                ResponseMessagesEnum.SERVER_ERROR;
            const stack = exception.message;

            this.logger.error(
                `STATUS [${status}] - MESSAGE [${message}]`,
                stack,
            );

            response.status(status).json(createResponse(status, message));
        }
    }
}
