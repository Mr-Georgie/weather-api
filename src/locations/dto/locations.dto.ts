import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsUUID,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";

export class LocationDto {
    @ApiProperty({
        example: "new york",
        description:
            "The name of the city to add to user's favorite list. Only letters, spaces, and hyphens are allowed.",
    })
    @IsString()
    @MinLength(2, { message: "City name must be at least 2 characters long." })
    @MaxLength(50, { message: "City name must not exceed 50 characters." })
    @Matches(/^[a-zA-Z\s-]+$/, {
        message: "City name can only contain letters, spaces, and hyphens.",
    })
    city: string;
}

export class IdParamDto {
    @IsUUID("4", { message: "Must be a valid UUID." })
    id: string;
}
