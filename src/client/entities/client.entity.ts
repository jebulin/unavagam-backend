import { Status } from "src/shared/enums/status";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column()
    contact: string;

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
