import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Exercise } from "./exercise.entity";
import {WorkoutType} from "../enums/workout-type.enums";

@Entity('workouts')
export class Workout {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({
        type: 'enum',
        enum: WorkoutType,
        default: WorkoutType.OTHER
    })
    type: WorkoutType;

    @Column({ type: 'timestamp' })
    workout_date: Date;

    @Column({ type: 'int', nullable: true })
    duration_minutes: number;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @Column()
    user_id: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.workouts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Exercise, (exercise) => exercise.workout, { cascade: true })
    exercises: Exercise[];
}