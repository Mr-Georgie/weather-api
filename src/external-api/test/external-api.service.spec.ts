import { Test, TestingModule } from "@nestjs/testing";
import { HttpService } from "@nestjs/axios";
import { AppConfigService } from "src/app-config/app-config.service";
import { CustomLoggerService } from "src/common/services/custom-logger.service";
import { ExternalApiService } from "../external-api.service";
import { of, throwError } from "rxjs";
import { AxiosError, AxiosResponse } from "axios";
import { RequestTimeoutException } from "@nestjs/common";
import { GraphQLError } from "graphql";
import * as operators from 'rxjs/operators';

describe("ExternalApiService", () => {
    let service: ExternalApiService;
    let httpService: HttpService;
    let appConfigService: AppConfigService;
    let logger: CustomLoggerService;

    const mockAxiosResponse: AxiosResponse = {
        data: { error: { message: "Invalid request" } },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: undefined,
    };

    const error = new AxiosError(
        "Request failed",
        undefined,
        undefined,
        undefined,
        mockAxiosResponse,
    );

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExternalApiService,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: AppConfigService,
                    useValue: {
                        getHttpTimeoutLimit: jest.fn().mockReturnValue(5000),
                        getHttpRetriesLimit: jest.fn().mockReturnValue(3),
                    },
                },
                {
                    provide: CustomLoggerService,
                    useValue: {
                        log: jest.fn(),
                        logAndThrow: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ExternalApiService>(ExternalApiService);
        httpService = module.get<HttpService>(HttpService);
        appConfigService = module.get<AppConfigService>(AppConfigService);
        logger = module.get<CustomLoggerService>(CustomLoggerService);
    });

    describe("fetchData", () => {
        it("should return data on successful response", async () => {
            jest.spyOn(httpService, "get").mockReturnValue(
                of(mockAxiosResponse),
            );

            const result = await service.fetchData("https://api.example.com");
            expect(result).toEqual(mockAxiosResponse.data);
            expect(httpService.get).toHaveBeenCalledWith(
                "https://api.example.com",
                expect.any(Object),
            );
        });

        it("should handle AxiosError and throw GraphQLError", async () => {
            jest.spyOn(httpService, "get").mockReturnValue(
                throwError(() => error),
            );

            await expect(
                service.fetchData("https://api.example.com"),
            ).rejects.toThrow(GraphQLError);

            expect(logger.log).toHaveBeenCalledWith(
                "fetchData",
                expect.stringContaining("Request failed"),
                "warn",
            );
        });
    });
});
