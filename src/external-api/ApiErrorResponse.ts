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

// {
//     "status":400,
//     "statusText":"Bad Request",
//     "data":{
//         "error":{
//             "code":1006,
//             "message":"No matching location found."
//         }
//     },
//     "message":"Request failed with status code 400",
//     "code":"ERR_BAD_REQUEST"
// }
