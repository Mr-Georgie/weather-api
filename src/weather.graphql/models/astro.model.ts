import { Field, ObjectType, Float, Int } from "@nestjs/graphql";

@ObjectType()
export class Astro {
    @Field({ nullable: true })
    sunrise: string;

    @Field({ nullable: true })
    sunset: string;

    @Field({ nullable: true })
    moonrise: string;

    @Field({ nullable: true })
    moonset: string;

    @Field({ nullable: true })
    moon_phase: string;

    @Field({ nullable: true })
    moon_illumination: string;
}