export interface CustomApiResponse<T = any> {
    status: string;
    statusCode: number;
    message: string;
    data?: T;
    error?: string;
}

export function createResponse<T>(
    status: string,
    statusCode: number,
    message: string,
    data?: T,
    error?: string,
): CustomApiResponse<T> {
    return {
        status,
        statusCode,
        message,
        data,
        error,
    };
}
