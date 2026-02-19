import {Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Car} from "../../car/entities/car.entity";

@Entity('maintenance')
export class Maintenance {
    @PrimaryGeneratedColumn()
    maintenance_id: number

    @Index()
    @Column()
    user_id: number

    @Index()
    @Column()
    car_id: number

    @Column()
    date: Date

    @Column()
    description: string

    @Column()
    odometer: number

    @CreateDateColumn()
    created_at: Date

    @ManyToOne(() => User, (user) => user.trips, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Car, (car) => car.trips, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'car_id' })
    car: Car;
}
