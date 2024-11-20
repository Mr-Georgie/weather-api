export interface ApiErrorResponse {
    response?: Response;
    message: string;
    code?: string;
}

interface Response {
    status: number;
    statusText: string;
    data: Data;
}

interface Data {
    error?: Error;
}

interface Error {
    code: number;
    message: string;
}
