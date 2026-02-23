import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Series } from "./series.entity";

@Entity('series_details')
export class SeriesDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    tmdb_id: number;

    @Column({ nullable: true })
    creator: string;

    @Column({ type: 'int', nullable: true })
    number_of_seasons: number;

    @Column({ type: 'int', nullable: true })
    number_of_episodes: number;

    @Column({ type: 'jsonb', nullable: true })
    cast: { name: string, character: string, profile_path: string | null }[];

    @Column({ type: 'jsonb', nullable: true })
    production_companies: { name: string, logo_path: string | null }[];

    @Column({ nullable: true })
    last_air_date: string;

    @OneToOne(() => Series, (series) => series.details, { onDelete: 'CASCADE' })
    series: Series;
}