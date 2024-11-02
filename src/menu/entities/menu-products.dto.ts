import { Status } from "src/shared/enums/status";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('menu_products')
export class MenuProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "menu_id" })
    menuId: number;

    @Column({ name: "product_id" })
    productId: number;

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
