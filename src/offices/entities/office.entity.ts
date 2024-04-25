import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Office {
  @PrimaryColumn()
  id: number;

  @Column()
  location: string;

  @OneToMany(() => Order, (o) => o.office)
  orders: Order[];
}
