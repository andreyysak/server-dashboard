import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Car } from './car.entity';

@Entity('car_pictures')
export class CarPicture {
    @PrimaryGeneratedColumn()
    picture_id: number;

    @Column()
    url: string;

    @Column({ default: false })
    is_main: boolean;

    @Column()
    car_id: number;

    @ManyToOne(() => Car, (car) => car.pictures, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'car_id' })
    car: Car;
}