import { Field, ObjectType, Float, Int } from "@nestjs/graphql";
import { Condition } from "./condition.model";

@ObjectType()
export class Day {
    @Field(() => Float, { nullable: true })
    maxtemp_c: number;

    @Field(() => Float, { nullable: true })
    maxtemp_f: number;

    @Field(() => Float, { nullable: true })
    mintemp_c: number;

    @Field(() => Float, { nullable: true })
    mintemp_f: number;

    @Field(() => Float, { nullable: true })
    avgtemp_c: number;

    @Field(() => Float, { nullable: true })
    avgtemp_f: number;

    @Field(() => Float, { nullable: true })
    maxwind_mph: number;

    @Field(() => Float, { nullable: true })
    maxwind_kph: number;

    @Field(() => Float, { nullable: true })
    totalprecip_mm: number;

    @Field(() => Float, { nullable: true })
    totalprecip_in: number;

    @Field(() => Float, { nullable: true })
    avgvis_km: number;

    @Field(() => Float, { nullable: true })
    avgvis_miles: number;

    @Field(() => Float, { nullable: true })
    avghumidity: number;

    @Field(() => Int, { nullable: true })
    daily_will_it_rain: number;

    @Field(() => Int, { nullable: true })
    daily_chance_of_rain: number;

    @Field(() => Int, { nullable: true })
    daily_will_it_snow: number;

    @Field(() => Int, { nullable: true })
    daily_chance_of_snow: number;

    @Field(() => Condition, { nullable: true })
    condition: Condition;

    @Field(() => Float, { nullable: true })
    uv: number;
}