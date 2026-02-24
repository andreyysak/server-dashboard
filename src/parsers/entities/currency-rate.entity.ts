import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('currency_rates')
export class CurrencyRate {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'USD' })
    @Column({ unique: true })
    code: string;

    @ApiProperty({ example: 'Долар США' })
    @Column()
    name: string;

    @ApiProperty({ example: 41.20 })
    @Column({ type: 'decimal', precision: 10, scale: 4 })
    rate: number;

    @ApiProperty({ example: '2026-02-24' })
    @Column()
    exchange_date: string;

    @UpdateDateColumn()
    updated_at: Date; 
}