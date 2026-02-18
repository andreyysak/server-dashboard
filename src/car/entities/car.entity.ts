import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Trip } from '../../trip/entities/trip.entity';
import { CarPicture } from './car-picture.entity';
import {Fuel} from "../../fuel/entities/fuel.entity";

@Entity('cars')
export class Car {
    @PrimaryGeneratedColumn()
    car_id: number;

    @Column()
    brand: string;

    @Column()
    model: string;

    @Column({ unique: true })
    vin_code: string;

    @Column({ nullable: true })
    license_plate: string;

    @Column({ nullable: true })
    year: number;

    @Column({ nullable: true })
    color: string;

    @Column({ nullable: true })
    fuel_type: string;

    @Column({ type: 'float', nullable: true })
    engine_capacity: number;

    @Column({ nullable: true })
    transmission: string;

    @Column({ type: 'int', default: 0 })
    current_mileage: number;

    @Column({ type: 'jsonb', nullable: true })
    features: any;

    @Column()
    user_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.cars, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Trip, (trip) => trip.car)
    trips: Trip[];

    @OneToMany(() => Fuel, (fuel) => fuel.car)
    fuels: Fuel[];

    @OneToMany(() => CarPicture, (picture) => picture.car, { cascade: true })
    pictures: CarPicture[];
}