import { Status } from "src/shared/enums/status";
import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity('shops')
export class Shop {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'client_id'})
    clientId: number;

    @Column()
    username: string;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column()
    contact: string;

    @Column({name: "subscription_name"})
    subscriptionName: string;

    @Column({name: "subscription_start_date"})
    subscriptionStartDate: string;

    @Column({name: "subscription_end_date"})
    subscriptionEndDate: string;

    @Column({ name: "created_at"})
    createdAt: string;

    @Column({ name: "created_by", default: null })
    createdBy: number;

    @Column({ name: "updated_at"})
    updatedAt: string;

    @Column({ name: "updated_by", default: null })
    updatedBy: number;

    @Column()
    status: Status;
}
