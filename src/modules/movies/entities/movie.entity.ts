import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { MovieStatus } from "../enums/movie-status.enum";
import { User } from "../../user/entities/user.entity";
import {MovieDetails} from "./movie-details.entity";

@Entity('movies')
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tmdb_id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    poster_path: string;

    @Column({ nullable: true })
    release_date: string;

    @Column({ type: 'text', nullable: true })
    overview: string;

    @Column({
        type: 'enum',
        enum: MovieStatus,
        default: MovieStatus.WATCH_LATER
    })
    status: MovieStatus;

    @Column({ type: 'int', nullable: true })
    user_rating: number;

    @Column({ type: 'text', nullable: true })
    user_comment: string | null;

    @Column()
    user_id: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.movies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne(() => MovieDetails, (details) => details.movie, { cascade: true })
    @JoinColumn({ name: 'details_id' })
    details: MovieDetails;
}