import { ArgsType, Field } from "@nestjs/graphql";
import { IsString, MinLength, MaxLength, Matches } from "class-validator";

@ArgsType()
export class CityArgs {
    @Field(() => String, {
        description:
            "The name of the city for which to retrieve data. Only letters, spaces, and hyphens are allowed.",
        // example: "Las Vegas",
    })
    @IsString()
    @MinLength(2, { message: "City name must be at least 2 characters long." })
    @MaxLength(50, { message: "City name must not exceed 50 characters." })
    @Matches(/^[a-zA-Z\s-]+$/, {
        message: "City name can only contain letters, spaces, and hyphens.",
    })
    city: string;
}
