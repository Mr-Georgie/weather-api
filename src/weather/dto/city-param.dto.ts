import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CityParamDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Matches(/^[a-zA-Z\s-]+$/, {
        message: "City can only contain letters, spaces, and hyphens",
    })
    city: string;
}
