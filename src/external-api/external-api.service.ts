import { HttpService } from "@nestjs/axios";
import {
    HttpException,
    Injectable,
    RequestTimeoutException,
} from "@nestjs/common";
import { AxiosError } from "axios";
import {
    catchError,
    firstValueFrom,
    retry,
    timeout,
    TimeoutError,
    timer,
} from "rxjs";
import { AppConfigService } from "src/app-config/app-config.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { LogMessagesEnum } from "src/common/enums/log-messages.enum";

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
                            delay: (error, attempt) => {
                                this.customLoggerService.log(
                                    method,
                                    `Retrying request to ${url} (Attempt ${attempt}/${retries})`,
                                    "warn",
                                );
                                this.customLoggerService.log(
                                    method,
                                    error.message,
                                    "warn",
                                );
                                // Calculate delay with exponential backoff
                                const delayMs = this.calculateBackoff(attempt);
                                return timer(delayMs);
                            },
                        }),
                        catchError((error) => {
                            if (error instanceof TimeoutError) {
                                this.customLoggerService.logAndThrow(
                                    `Request to ${url} timed out after ${timeoutMs}ms`,
                                    method,
                                    RequestTimeoutException,
                                );
                            }

                            if (error instanceof AxiosError) {
                                this.customLoggerService.log(
                                    method,
                                    LogMessagesEnum.API_REQUEST_FAILURE,
                                    "warn",
                                );
                                this.customLoggerService.logAndThrow(
                                    `${error.response?.data?.message || error.message}`,
                                    method,
                                    HttpException,
                                );
                            }

                            throw error;
                        }),
                    ),
            );

            return response.data;
        } catch (error) {
            this.customLoggerService.handleError(
                error instanceof Error ? error.stack : error.message,
                method,
            );
        }
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
}
