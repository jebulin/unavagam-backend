import { Status } from "src/shared/enums/status";
import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity('shop_users')
export class ShopUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'shop_id' })
    shopId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'role_id' })
    roleId: number;

    @Column({ name: 'created_by' })
    createdBy: number;

    @Column({ name: 'created_at' })
    createdAt: string;

    @Column({ name: 'updated_by' })
    updatedBy: number;

    @Column({ name: 'updated_at' })
    updatedAt: string

    @Column({ type: 'tinyint' })
    status: Status;

}
