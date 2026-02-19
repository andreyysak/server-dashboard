import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { UserRole } from "../enums/user-role.enum";
import { Trip } from "../../trip/entities/trip.entity";
import { Car } from "../../car/entities/car.entity";
import { Fuel } from "../../fuel/entities/fuel.entity";
import { Account } from "../../account/entities/account.entity";
import { Category } from "../../category/entities/category.entity";
import { Transaction } from "../../transaction/entities/transaction.entity";
import {Maintenance} from "../../maintenance/entities/maintenance.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ unique: true, nullable: false })
    email: string;

    @Exclude()
    @Column({ nullable: true })
    googleId: string;

    @Column({ nullable: true })
    googleName: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    telegram_name: string;

    @Column({ nullable: true })
    telegram_username: string;

    @Exclude()
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
    role: UserRole;

    @Column({ nullable: true })
    image: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Trip, (trip) => trip.user)
    trips: Trip[];

    @OneToMany(() => Car, (car) => car.user)
    cars: Car[];

    @OneToMany(() => Fuel, (fuel) => fuel.user)
    fuels: Fuel[];

    @OneToMany(() => Maintenance, (maintenance) => maintenance.user)
    maintenances: Maintenance[];

    @OneToMany(() => Account, (account) => account.user)
    accounts: Account[];

    @OneToMany(() => Category, (category) => category.user)
    categories: Category[];

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];
}