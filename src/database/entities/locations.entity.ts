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
    ManyToOne,
    JoinColumn,
    Unique,
} from "typeorm";
import { User } from "./users.entity";

@Entity()
@Unique(["user_id", "city"]) // Composite unique constraint
export class Location extends BaseEntity {
    @PrimaryColumn("uuid", {
        primary: true,
        name: "id",
        default: () => "gen_random_uuid()",
    })
    id: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    city: string;

    @ManyToOne(() => User, (user) => user.locations, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column("uuid", {
        name: "user_id",
        nullable: false,
    })
    user_id: string;

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
