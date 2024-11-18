import { HttpService } from "@nestjs/axios";
import {
    BadRequestException,
    HttpException,
    Injectable,
    RequestTimeoutException,
} from "@nestjs/common";
import { AxiosError } from "axios";
import {
    catchError,
    firstValueFrom,
    Observable,
    retry,
    timeout,
    TimeoutError,
    timer,
} from "rxjs";
import { AppConfigService } from "src/app-config/app-config.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { LogMessagesEnum } from "src/common/enums/log-messages.enum";
import { GraphQLError } from "graphql";
import { ApiErrorResponse } from "./ApiErrorResponse";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
// import { ExternalApiErrorResponse } from "./ExternalApiResponse";

@Injectable()
export class ExternalApiService {
    constructor(
        private readonly httpService: HttpService,
        private readonly appConfigService: AppConfigService,
        private readonly customLoggerService: CustomLoggerService,
    ) {}

    async fetchData<T>(
        url: string,
        options: {
            timeoutMs?: number;
            retries?: number;
            headers?: Record<string, string>;
        } = {},
    ): Promise<T> {
        const {
            timeoutMs = this.appConfigService.getHttpTimeoutLimit(),
            retries = this.appConfigService.getHttpRetriesLimit(),
            headers = {},
        } = options;

        const method = this.fetchData.name;

        try {
            const response = await firstValueFrom(
                this.httpService
                    .get<T>(url, {
                        headers: {
                            "Content-Type": "application/json",
                            ...headers,
                        },
                    })
                    .pipe(
                        timeout(timeoutMs), // Timeout for the request
                        retry({
                            count: retries,
                            delay: (error, attempt) =>
                                this.handleRetry(
                                    error,
                                    attempt,
                                    retries,
                                    url,
                                    method,
                                ),
                        }),
                        catchError((error) =>
                            this.handleError(error, url, method, timeoutMs),
                        ),
                    ),
            );

            return response.data;
        } catch (error) {
            throw error; // Re-throw the error to avoid silent failures
        }
    }

    private handleRetry(
        error: any,
        attempt: number,
        retries: number,
        url: string,
        method: string,
    ): Observable<number> {
        const statusCode = error.response?.status;
        // Do not retry error with 400, 401 or 403 status
        if (statusCode == 400 || statusCode == 401 || statusCode == 403) {
            throw error;
        }
        this.customLoggerService.log(
            method,
            `Retrying request to ${url} (Attempt ${attempt}/${retries}) - ${error.message}`,
            "warn",
        );
        const delayMs = this.calculateBackoff(attempt);
        return timer(delayMs);
    }

    private handleError(
        error: any,
        url: string,
        method: string,
        timeoutMs: number,
    ): never {
        {
            if (error instanceof TimeoutError) {
                this.customLoggerService.logAndThrow(
                    `Request to ${url} timed out after ${timeoutMs}ms`,
                    method,
                    RequestTimeoutException,
                );
            }

            if (error instanceof AxiosError) {
                this.handleAxiosError(error, method);
            }
            // Rethrow any other error
            throw error;
        }
    }

    private handleAxiosError(error: ApiErrorResponse, method: string): void {
        const errorInfo = {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            code: error.code,
        };

        this.customLoggerService.log(
            method,
            `Request failed: ${JSON.stringify(errorInfo)}`,
            "warn",
        );

        // Throw GraphQL error with detailed extensions
        throw new GraphQLError(error.response?.data?.error?.message, {
            extensions: {
                status: error.response?.status || 500,
                code: this.formatCode(error.response?.status),
                method,
            },
        });
    }

    private calculateBackoff(retryCount: number): number {
        // Exponential backoff with jitter
        const baseDelay = 1000; // 1 second
        const maxDelay = 10000; // 10 seconds
        const exponentialDelay = Math.min(
            maxDelay,
            baseDelay * Math.pow(2, retryCount - 1),
        );
        // Add random jitter of ±100ms
        return exponentialDelay + Math.random() * 200 - 100;
    }

    private formatCode(statusCode: number): string {
        switch (
            statusCode 
        ) {
            case 400:
                return ResponseMessagesEnum.BAD_REQUEST
            case 401:
                return ResponseMessagesEnum.UNAUTHORIZED
            case 403:
                return ResponseMessagesEnum.API_KEY_LIMIT_ISSUES
            default:
                return ResponseMessagesEnum.SERVER_ERROR
            }
    }
}
