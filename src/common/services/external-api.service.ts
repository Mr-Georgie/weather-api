import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, timeout, retry, firstValueFrom, timer } from 'rxjs';
import { TimeoutError } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { ErrorMessagesEnum } from '../enums/error-messages.enum';

@Injectable()
export class ExternalApiService {
    private readonly logger = new Logger(ExternalApiService.name);

    constructor(
        private readonly httpService: HttpService,
        private appConfigService: AppConfigService,
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

        try {
            const response = await firstValueFrom(
                this.httpService
                    .get<T>(url, {
                        headers: {
                            'Content-Type': 'application/json',
                            ...headers,
                        },
                    })
                    .pipe(
                        timeout(timeoutMs), // Timeout for the request
                        retry({
                            count: retries,
                            delay: (error, attempt) => {
                                this.logger.warn(
                                    `Retrying request to ${url} (Attempt ${attempt}/${retries})`,
                                    error.message,
                                );
                                // Calculate delay with exponential backoff
                                const delayMs = this.calculateBackoff(attempt);
                                return timer(delayMs);
                            },
                        }),
                        catchError((error) => {
                            if (error instanceof TimeoutError) {
                                throw new Error(
                                    `Request to ${url} timed out after ${timeoutMs}ms`,
                                );
                            }

                            if (error instanceof AxiosError) {
                                throw new Error(
                                    `${ErrorMessagesEnum.EXTERNAL_API_FAILURE}: ${error.response?.data?.message || error.message}`,
                                );
                            }

                            throw error;
                        }),
                    ),
            );

            return response.data;
        } catch (error) {
            this.logger.error(
                `Failed to fetch data from ${url}`,
                error instanceof Error ? error.stack : String(error),
            );
            throw error;
        }
    }

    async postData<T, R>(
        url: string,
        data: T,
        options: {
            timeoutMs?: number;
            retries?: number;
            headers?: Record<string, string>;
        } = {},
    ): Promise<R> {
        const {
            timeoutMs = this.appConfigService.getHttpTimeoutLimit(),
            retries = this.appConfigService.getHttpRetriesLimit(),
            headers = {},
        } = options;

        try {
            const response = await firstValueFrom(
                this.httpService
                    .post<R>(url, data, {
                        headers: {
                            'Content-Type': 'application/json',
                            ...headers,
                        },
                    })
                    .pipe(
                        timeout(timeoutMs),
                        retry({
                            count: retries,
                            delay: (error, attempt) => {
                                this.logger.warn(
                                    `Retrying POST request to ${url} (Attempt ${attempt}/${retries})`,
                                    error.message,
                                );
                                const delayMs = this.calculateBackoff(attempt);
                                return timer(delayMs);
                            },
                        }),
                        catchError((error) => {
                            if (error instanceof TimeoutError) {
                                throw new Error(
                                    `POST request to ${url} timed out after ${timeoutMs}ms`,
                                );
                            }

                            if (error instanceof AxiosError) {
                                throw new Error(
                                    `${ErrorMessagesEnum.EXTERNAL_API_FAILURE}: ${error.response?.data?.message || error.message}`,
                                );
                            }

                            throw error;
                        }),
                    ),
            );

            return response.data;
        } catch (error) {
            this.logger.error(
                `Failed to post data to ${url}`,
                error instanceof Error ? error.stack : String(error),
            );
            throw error;
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
