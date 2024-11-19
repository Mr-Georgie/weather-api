import { RATE_LIMITS } from "src/throttler/rate-limit.config";
import { ResponseMessagesEnum } from "../enums/response-messages.enum";

export const getErrorCode = (status: number): [string, string] => {
    const errorMap: Record<number, [string, string]> = {
        400: ["BAD_REQUEST", ResponseMessagesEnum.BAD_REQUEST],
        401: ["UNAUTHORIZED", ResponseMessagesEnum.UNAUTHORIZED],
        403: ["FORBIDDEN", ResponseMessagesEnum.FORBIDDEN],
        404: ["NOT_FOUND", ResponseMessagesEnum.BAD_REQUEST],
        429: ["TOO_MANY_REQUESTS", ResponseMessagesEnum.TOO_MANY_REQUEST],
    };

    return (
        errorMap[status] || [
            "INTERNAL_SERVER_ERROR",
            ResponseMessagesEnum.SERVER_ERROR,
        ]
    );
};
