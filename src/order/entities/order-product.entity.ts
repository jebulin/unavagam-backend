import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/order-status.enum";
import { OrderProductStatus } from "../enum/order-product-status.enum";

@Entity("order_products")
export class OrderProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "order_id" })
    orderId: number;

    @Column({ name: "product_id" })
    productId: number;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: string;

    @Column({ name: "created_by", default: null })
    createdBy: number;

    @Column({ name: "updated_at", type: "timestamp" })
    updatedAt: string;

    @Column({ name: "updated_by", default: null })
    updatedBy: number;

    @Column({ type: 'tinyint' })
    status: OrderProductStatus;
}
