import { Status } from "src/shared/enums/status";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: "type_id" })
    typeId: number;

    @Column({ name: "parent_id" })
    parentId: number;

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
