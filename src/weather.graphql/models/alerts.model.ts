import { Field, ObjectType, Float, Int } from "@nestjs/graphql";

@ObjectType()
export class Alert {
    @Field({ nullable: true })
    headline: string;

    @Field({ nullable: true })
    msgtype: string;

    @Field({ nullable: true })
    severity: string;

    @Field({ nullable: true })
    urgency: string;

    @Field({ nullable: true })
    areas: string;

    @Field({ nullable: true })
    category: string;

    @Field({ nullable: true })
    certainty: string;

    @Field({ nullable: true })
    event: string;

    @Field({ nullable: true })
    note: string;

    @Field({ nullable: true })
    effective: string;

    @Field({ nullable: true })
    expires: string;

    @Field({ nullable: true })
    desc: string;

    @Field({ nullable: true })
    instruction: string;
}

@ObjectType()
export class Alerts {
    @Field(() => [Alert], { nullable: true })
    alert: Alert[];
}
