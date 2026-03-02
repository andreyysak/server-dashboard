import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Car } from '../../car/entities/car.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn()
  trip_id: number;

  @Index()
  @Column()
  user_id: number;

  @Column()
  car_id: number;

  @Column({ type: 'float' })
  kilometres: number;

  @Column({ type: 'float', nullable: true })
  distance: number;

  @Column()
  direction: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.trips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Car, (car) => car.trips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car: Car;
}
