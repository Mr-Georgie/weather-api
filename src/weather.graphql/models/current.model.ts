import { Field, ObjectType, Float, Int } from "@nestjs/graphql";
import { Condition } from "./condition.model";
import { Location } from "./location.model";

@ObjectType()
export class Current {
    @Field(() => Int, { nullable: true })
    last_updated_epoch: number;

    @Field({ nullable: true })
    last_updated: string;

    @Field(() => Float, { nullable: true })
    temp_c: number;

    @Field(() => Float, { nullable: true })
    temp_f: number;

    @Field(() => Int, { nullable: true })
    is_day: number;

    @Field(() => Condition, { nullable: true })
    condition: Condition;
}

@ObjectType()
export class CurrentCityWeather {
    @Field(() => Location, { nullable: true })
    location: Location;

    @Field(() => Current, { nullable: true })
    current: Current;
}
