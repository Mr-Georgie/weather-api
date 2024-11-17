import { Field, ObjectType, Float, Int } from "@nestjs/graphql";
import { Day } from "./day.model";
import { Astro } from "./astro.model";
import { Hour } from "./hour.model";
import { Current } from "./current.model";
import { Alerts } from "./alerts.model";
import { Location } from "./location.model";

@ObjectType()
export class ForecastDay {
    @Field({ nullable: true })
    date: string;

    @Field(() => Int, { nullable: true })
    date_epoch: number;

    @Field(() => Day, { nullable: true })
    day: Day;

    @Field(() => Astro, { nullable: true })
    astro: Astro;

    @Field(() => [Hour], { nullable: "itemsAndList" })
    hour: Hour[];
}

@ObjectType()
export class Forecast {
    @Field(() => [ForecastDay], { nullable: "itemsAndList" })
    forecastday: ForecastDay[];
}

@ObjectType()
export class ForecastWeather {
    @Field(() => Location, { nullable: true })
    location: Location;

    @Field(() => Current, { nullable: true })
    current: Current;

    @Field(() => Forecast, { nullable: true })
    forecast: Forecast;

    @Field(() => Alerts, { nullable: true })
    alerts: Alerts;
}
