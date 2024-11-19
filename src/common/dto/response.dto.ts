import { ApiProperty } from "@nestjs/swagger";
import { StatusEnum } from "../enums/status.enum";
import { ResponseMessagesEnum } from "../enums/response-messages.enum";

// Define the Error Model
export class ErrorResponse {
    @ApiProperty({ example: StatusEnum.ERROR })
    status: string;

    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ example: ResponseMessagesEnum.PASSWORD_WEAK })
    message: string | string[];
}

// Define the Success Model
export class SuccessResponse {
    @ApiProperty({ example: StatusEnum.SUCCESS })
    status: string;

    @ApiProperty({ example: ResponseMessagesEnum.SUCCESS })
    statusCode: number;

    @ApiProperty({ example: "Created successfully" })
    message: string | string[];

    @ApiProperty({ example: { id: 1, name: "John Doe" } })
    data?: any;
}
