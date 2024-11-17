import { Field, ObjectType, Float, Int } from "@nestjs/graphql";
import { Condition } from "./condition.model";

@ObjectType()
export class Hour {
    @Field(() => Int, { nullable: true })
    time_epoch: number;

    @Field({ nullable: true })
    time: string;

    @Field(() => Float, { nullable: true })
    temp_c: number;

    @Field(() => Float, { nullable: true })
    temp_f: number;

    @Field(() => Int, { nullable: true })
    is_day: number;

    @Field(() => Condition, { nullable: true })
    condition: Condition;

    @Field(() => Float, { nullable: true })
    wind_mph: number;

    @Field(() => Float, { nullable: true })
    wind_kph: number;

    @Field(() => Int, { nullable: true })
    wind_degree: number;

    @Field({ nullable: true })
    wind_dir: string;

    @Field(() => Float, { nullable: true })
    pressure_mb: number;

    @Field(() => Float, { nullable: true })
    pressure_in: number;

    @Field(() => Float, { nullable: true })
    precip_mm: number;

    @Field(() => Float, { nullable: true })
    precip_in: number;

    @Field(() => Int, { nullable: true })
    humidity: number;

    @Field(() => Int, { nullable: true })
    cloud: number;

    @Field(() => Float, { nullable: true })
    feelslike_c: number;

    @Field(() => Float, { nullable: true })
    feelslike_f: number;

    @Field(() => Float, { nullable: true })
    windchill_c: number;

    @Field(() => Float, { nullable: true })
    windchill_f: number;

    @Field(() => Float, { nullable: true })
    heatindex_c: number;

    @Field(() => Float, { nullable: true })
    heatindex_f: number;

    @Field(() => Float, { nullable: true })
    dewpoint_c: number;

    @Field(() => Float, { nullable: true })
    dewpoint_f: number;

    @Field(() => Int, { nullable: true })
    will_it_rain: number;

    @Field(() => Int, { nullable: true })
    chance_of_rain: number;

    @Field(() => Int, { nullable: true })
    will_it_snow: number;

    @Field(() => Int, { nullable: true })
    chance_of_snow: number;

    @Field(() => Float, { nullable: true })
    vis_km: number;

    @Field(() => Float, { nullable: true })
    vis_miles: number;

    @Field(() => Float, { nullable: true })
    gust_mph: number;

    @Field(() => Float, { nullable: true })
    gust_kph: number;

    @Field(() => Float, { nullable: true })
    uv: number;
}