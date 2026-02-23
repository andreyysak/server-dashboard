import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Movie } from "./movie.entity";

@Entity('movie_details')
export class MovieDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    tmdb_id: number;

    @Column({ nullable: true })
    director: string;

    @Column({ type: 'bigint', nullable: true })
    budget: number;

    @Column({ type: 'bigint', nullable: true })
    revenue: number;

    @Column({ type: 'jsonb', nullable: true })
    cast: { name: string, character: string, profile_path: string | null }[];

    @Column({ type: 'jsonb', nullable: true })
    production_companies: { name: string, logo_path: string | null }[];

    @Column({ nullable: true })
    runtime: number;

    @OneToOne(() => Movie, (movie) => movie.details, { onDelete: 'CASCADE' })
    movie: Movie;
}