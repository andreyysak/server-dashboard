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
import { FuelStation } from '../enums/fuel-station.enum';
import { User } from '../../user/entities/user.entity';
import { Car } from '../../car/entities/car.entity';

@Entity('fuel')
export class Fuel {
  @PrimaryGeneratedColumn()
  gas_id: number;

  @Index()
  @Column()
  user_id: number;

  @Index()
  @Column()
  car_id: number;

  @Column({ type: 'float' })
  liters: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'enum', enum: FuelStation, default: FuelStation.OKKO })
  station: FuelStation;

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
