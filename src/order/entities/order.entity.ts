import { Status } from "src/shared/enums/status";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/order-status.enum";

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "order_id" })
    orderId: string;

    @Column({ name: "shop_id" })
    shopId: number;

    @Column()
    type: number;

    @Column()
    total: number;

    @Column({name: "total_quantity"})
    totalQuantity: number;

    @Column({name:"customer_id"})
    customerId: number;

    @Column({name: "payment_method"})
    paymentMethod: string;

    @Column({name: "payment_status"})
    paymentStatus: number;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: string;

    @Column({ name: "created_by", default: null })
    createdBy: number;

    @Column({ name: "updated_at", type: "timestamp" })
    updatedAt: string;

    @Column({ name: "updated_by", default: null })
    updatedBy: number;

    @Column({ type: 'tinyint' })
    status: OrderStatus;
}
