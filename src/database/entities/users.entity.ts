import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BaseEntity,
    BeforeInsert,
    PrimaryGeneratedColumn,
    OneToMany,
} from "typeorm";
import { Location } from "./locations.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn("uuid", {
        primary: true,
        name: "id",
        default: () => "gen_random_uuid()",
    })
    id: string;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    password_hash: string;

    @OneToMany(() => Location, location => location.user)
    locations: Location[];

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp",
    })
    created_at: Date;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamp",
    })
    updated_at: Date;

    @DeleteDateColumn({
        name: "deleted_at",
        type: "timestamp",
        nullable: true,
    })
    deleted_at?: Date;
}
