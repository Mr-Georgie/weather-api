import { ResponseCodesEnum } from "src/common/enums/response-codes.enum";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { StatusEnum } from "src/common/enums/status.enum";

export const GET_USER_EXAMPLE = {
    summary: "Get User Success Example",
    value: {
        status: StatusEnum.SUCCESS,
        statusCode: ResponseCodesEnum.SUCCESS,
        message: ResponseMessagesEnum.SUCCESS,
        data: {
            id: "9c95decd-xxxx-xxxx-xxxx-fed03a29fec5",
            email: "xx@exxx.com",
            created_at: "2024-11-18T16:55:05.783Z",
            updated_at: "2024-11-18T16:55:05.783Z",
            deleted_at: null,
        },
    },
};

export const SUCCESS_EXAMPLE = {
    summary: "Success Example",
    value: {
        status: StatusEnum.SUCCESS,
        statusCode: ResponseCodesEnum.SUCCESS,
        message: ResponseMessagesEnum.SUCCESS,
    },
};

export const BAD_REQUEST_EMAIL = {
    summary: "Bad Request Error Example",
    value: {
        status: StatusEnum.ERROR,
        statusCode: ResponseCodesEnum.BAD_REQUEST,
        message: ResponseMessagesEnum.EMAIL_ALREADY_EXISTS,
    },
};

export const BAD_REQUEST_INVALID_ID = {
    summary: "Bad Request Error Example",
    value: {
        status: StatusEnum.ERROR,
        statusCode: ResponseCodesEnum.BAD_REQUEST,
        message: ResponseMessagesEnum.INVALID_ID,
    },
};

export const BAD_REQUEST_PASSWORD = {
    summary: "Bad Request Error Example",
    value: {
        status: StatusEnum.ERROR,
        statusCode: ResponseCodesEnum.BAD_REQUEST,
        message: [ResponseMessagesEnum.PASSWORD_WEAK],
    },
};

export const BAD_REQUEST_CITY = {
    summary: "Bad Request City Error Example",
    value: {
        status: StatusEnum.ERROR,
        statusCode: ResponseCodesEnum.BAD_REQUEST,
        message: [ResponseMessagesEnum.INVALID_CITY],
    },
};

export const UNAUTHORIZED_EXAMPLE = {
    summary: "Unauthorized Error Example",
    value: {
        status: StatusEnum.ERROR,
        statusCode: ResponseCodesEnum.UNAUTHORIZED,
        message: ResponseMessagesEnum.UNAUTHORIZED,
    },
};

export const RATE_LIMIT_EXAMPLE = {
    summary: "Rate Limit Error Example",
    value: {
        status: StatusEnum.ERROR,
        statusCode: ResponseCodesEnum.TOO_MANY_REQUEST,
        message: ResponseMessagesEnum.TOO_MANY_REQUEST,
    },
};

export const INTERNAL_SERVER_ERROR = {
    summary: "Internal Server Error Example",
    value: {
        status: StatusEnum.ERROR,
        statusCode: ResponseCodesEnum.SERVER_ERROR,
        message: ResponseMessagesEnum.SERVER_ERROR,
    },
};
