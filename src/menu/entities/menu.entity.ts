import { Status } from "src/shared/enums/status";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('menus')
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "shop_id" })
    shopId: number;

    @Column()
    name: string;

    @Column({ name: "start_time" })
    startTime: string;

    @Column({name: "end_time"})
    endTime: string;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: string;

    @Column({ name: "created_by", default: null })
    createdBy: number;

    @Column({ name: "updated_at", type: "timestamp" })
    updatedAt: string;

    @Column({ name: "updated_by", default: null })
    updatedBy: number;

    @Column({ type: 'tinyint' })
    status: Status;
}
