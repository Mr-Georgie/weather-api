import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";

@Injectable()
export class CustomLoggerService {
    private readonly logger = new Logger(CustomLoggerService.name);

    log(method: string, message: string, type?: string): void {
        if (type === "warn") {
            this.logger.warn(this.formatMessage(method, message));
        } else {
            this.logger.log(this.formatMessage(method, message));
        }
    }

    logAndThrow(
        message: string,
        method: string,
        ExceptionType: new (...args: any[]) => Error,
    ): never {
        this.logger.warn(this.formatMessage(method, message));
        throw new ExceptionType(message);
    }

    handleError(error: Error, method: string): never {
        this.logger.error(
            this.formatMessage(method, error.message),
            error.stack,
        );
        throw new InternalServerErrorException(
            "An internal server error occurred",
        );
    }

    private formatMessage(method: string, metadata: string): string {
        return `[${method}] - MESSAGE [${metadata}]`;
    }
}
