import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {SeriesStatus} from "../enums/series-status.enum";
import {User} from "../../user/entities/user.entity";
import {SeriesDetails} from "./series-details.entity";

@Entity('series')
export class Series {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    tmdb_id: number

    @Column()
    title: string

    @Column({nullable: true})
    poster_path: string

    @Column({nullable: true})
    first_air_date: string

    @Column({
        type: 'enum',
        enum: SeriesStatus,
        default: SeriesStatus.WATCH_LATER
    })
    status: SeriesStatus

    @Column({ type: 'int', default: 1 })
    current_season: number;

    @Column({ type: 'int', default: 1 })
    current_episode: number;

    @Column({ type: 'int', nullable: true })
    user_rating: number;

    @Column({ type: 'text', nullable: true })
    user_comment: string | null;

    @Column()
    user_id: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.series, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne(() => SeriesDetails, (details) => details.series, { cascade: true })
    @JoinColumn({ name: 'details_id' })
    details: SeriesDetails;
}
