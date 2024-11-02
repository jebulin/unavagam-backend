import { Status } from "src/shared/enums/status";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name", default: null })
    lastName: string;

    @Column({ name: "phone_number", unique: true })
    phoneNumber: string;

    @Column({unique: true })
    email: string;

    @Column()
    password: string;

    @Column({name: "role_id"})
    roleId: number;

    @Column()
    otp: string;

    @Column({name: "otp_expiry"})
    otpExpiry: string;

    @Column({ name: "last_active", default: null, type: "timestamp" })
    lastActive: Date;

    @Column({ name: "created_at", type: "timestamp"})
    createdAt: string;

    @Column({ name: "created_by", default: null })
    createdBy: number;

    @Column({ name: "updated_at", type: "timestamp" })
    updatedAt: string;

    @Column({ name: "updated_by", default: null })
    updatedBy: number;

    @Column({type: 'tinyint'})
    status: Status;
}
