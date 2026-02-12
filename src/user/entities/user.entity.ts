import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number

    @Column({ unique: true, nullable: false})
    email: string

    @Column({ nullable: true })
    phone: string

    @Column({ nullable: true })
    telegram_name: string;

    @Column({ nullable: true })
    telegram_username: string;

    @Column({ unique: true })
    telegram_user_id: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    city: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole

    @CreateDateColumn()
    created_at: Date
}
