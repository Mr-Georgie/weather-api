import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";

@Injectable()
export class CustomLoggerService {
    private readonly logger = new Logger(CustomLoggerService.name);

    log(action: string, message: string): void {
        this.logger.log(`${action}: ${message}`);
    }

    logAndThrow(
        message: string,
        action: string,
        ExceptionType: new (...args: any[]) => Error,
    ): never {
        this.logger.warn(`${action}: ${message}`);
        throw new ExceptionType(message);
    }

    handleError(error: Error, action: string): never {
        this.logger.error(`${action}: ${error.message}`, error.stack);
        throw new InternalServerErrorException(
            "An internal server error occurred",
        );
    }
}
