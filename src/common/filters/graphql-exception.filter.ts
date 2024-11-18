import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from "@nestjs/common";
import { GqlArgumentsHost, GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch(HttpException)
export class GraphQLExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GraphQLExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);

        // Extract response details
        const response = exception.getResponse() as any;
        const status = exception.getStatus();
        const errorMessage = Array.isArray(response?.message)
            ? response.message.join(", ")
            : response?.message || "An error occurred";

        // Log the error for debugging
        this.logger.error(
            `GraphQL Exception: STATUS [${status}] - MESSAGE [${errorMessage}]`,
        );

        return new GraphQLError(errorMessage, {
            extensions: {
                code: this.getErrorCode(status),
                status,
            },
        });
    }

    private getErrorCode(status: number): string {
        switch (status) {
            case 400:
                return "BAD_REQUEST";
            case 401:
                return "UNAUTHORIZED";
            case 403:
                return "FORBIDDEN";
            case 404:
                return "NOT_FOUND";
            case 429:
                return "TOO_MANY_REQUESTS";
            default:
                return "INTERNAL_SERVER_ERROR";
        }
    }
}
