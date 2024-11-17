import { Catch, HttpException, Logger } from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch()
export class GraphQLErrorFilter implements GqlExceptionFilter {
    private readonly logger = new Logger(GraphQLErrorFilter.name);

    catch(exception: Error) {
        // Log the original error
        this.logger.error(
            `GraphQL Error: ${exception.message}`,
            exception.stack,
        );

        if (exception instanceof HttpException) {
            // Handle NestJS HTTP exceptions
            return new GraphQLError(exception.message, {
                extensions: {
                    code: this.getErrorCode(exception.getStatus()),
                    status: exception.getStatus(),
                },
            });
        }

        // Handle other errors
        return new GraphQLError("Internal server error", {
            extensions: {
                code: "INTERNAL_SERVER_ERROR",
                status: 500,
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
