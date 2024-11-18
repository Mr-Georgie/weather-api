import { Module } from "@nestjs/common";
import { WeatherGraphqlResolver } from "./weather.graphql.resolver";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { WeatherModule } from "src/weather/weather.module";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { GraphQLExceptionFilter } from "src/common/filters/graphql-exception.filter";
import { APP_FILTER } from "@nestjs/core";

@Module({
    imports: [
        WeatherModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true, // In-memory schema
            sortSchema: true, // Keeps schema organized
            introspection: true, // Enables schema exploration
            playground: true, // Enables Apollo Studio Explorer
            // gracefully handle errors
            formatError: (error) => {
                console.log("formatError invoked:", error);

                const graphQLFormattedError = {
                    message: error.message,
                    data: error.extensions?.data,
                    code:
                        error.extensions?.code ||
                        ResponseMessagesEnum.SERVER_ERROR,
                    status: error.extensions?.status || 500,
                    path: error.path,
                    method: error.extensions?.method,
                };
                return graphQLFormattedError;
            },
        }),
    ],
    providers: [
        WeatherGraphqlResolver,
        {
            provide: APP_FILTER,
            useClass: GraphQLExceptionFilter,
        },
    ],
})
export class WeatherGraphqlModule {}
