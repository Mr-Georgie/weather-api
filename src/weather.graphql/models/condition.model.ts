import { Field, ObjectType, Float, Int } from "@nestjs/graphql";

@ObjectType()
export class Condition {
    @Field({ nullable: true })
    text: string;

    @Field({ nullable: true })
    icon: string;

    @Field(() => Int, { nullable: true })
    code: number;
}