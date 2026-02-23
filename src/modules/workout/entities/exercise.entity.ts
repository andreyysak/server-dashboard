import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Workout } from "./workout.entity";

@Entity('exercises')
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'int', nullable: true })
    sets: number;

    @Column({ type: 'int', nullable: true })
    reps: number;

    @Column({ type: 'float', nullable: true })
    weight: number;

    @Column({ type: 'float', nullable: true })
    distance_km: number;

    @Column({ type: 'int', nullable: true })
    duration_seconds: number;

    @Column({ type: 'int', nullable: true })
    order: number;

    @Column()
    workout_id: number;

    @ManyToOne(() => Workout, (workout) => workout.exercises, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workout_id' })
    workout: Workout;
}