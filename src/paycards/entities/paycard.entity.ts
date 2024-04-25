import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Entity()
export class PayCard {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column()
  cardNumber: string;

  @Column()
  validThrough: string;

  @Column()
  cvv: number;

  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Transaction, (t) => t.id)
  transactions: Transaction[];
}
