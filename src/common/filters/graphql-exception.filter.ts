import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from "@nestjs/common";
import { GqlArgumentsHost, GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { ResponseMessagesEnum } from "../enums/response-messages.enum";
import { LogMessagesEnum } from "../enums/log-messages.enum";
import { getErrorCode } from "../utils/general.utils";

@Catch(HttpException)
export class GraphQLExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GraphQLExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host); // Extract GraphQL context
        if (!gqlHost) {
            return; // Skip if it's not a GraphQL context
        }

        // Extract response details
        const response = exception.getResponse() as any;
        const status = exception.getStatus();

        let [code, message] = getErrorCode(status);

        const errorMessage = Array.isArray(response?.message)
            ? response.message.join(", ")
            : response?.message || message;

        // Log the error for debugging
        this.logger.error(
            `GraphQL Exception: STATUS [${status}] - MESSAGE [${errorMessage}]`,
        );

        return new GraphQLError(errorMessage, {
            extensions: {
                code: code,
                status,
            },
        });
    }
}
