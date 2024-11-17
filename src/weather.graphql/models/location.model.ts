import { Field, ObjectType, Float, Int } from "@nestjs/graphql";

@ObjectType()
export class Location {
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    region: string;

    @Field({ nullable: true })
    country: string;

    @Field(() => Float, { nullable: true })
    lat: number;

    @Field(() => Float, { nullable: true })
    lon: number;

    @Field({ nullable: true })
    tz_id: string;

    @Field({ nullable: true })
    localtime: string;

    @Field(() => Int, { nullable: true })
    localtime_epoch: number;
}
