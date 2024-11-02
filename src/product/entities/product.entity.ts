import { Status } from "src/shared/enums/status";
import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "shop_id" })
    shopId: number;

    @Column()
    name: string;

    @Column({ name: "category_id" })
    categoryId: number;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    stock: number;

    @Column()
    rating: number;

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
