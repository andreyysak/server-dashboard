import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Transaction } from "../../transaction/entities/transaction.entity";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    category_id: number

    @Index()
    @Column()
    user_id: number

    @Column()
    name: string

    @Column()
    type: string

    @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Transaction, (transaction) => transaction.category)
    transactions: Transaction[];
}