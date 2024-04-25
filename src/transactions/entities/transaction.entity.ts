import { PayCard } from 'src/paycards/entities/paycard.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: number;

  @Column()
  sum: number;

  @Column()
  date: Date;

  @ManyToOne(() => PayCard, (pc) => pc.transactions)
  card: PayCard;
}
