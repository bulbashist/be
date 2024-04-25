import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderStatus {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Order, (o) => o.status)
  order: Order;
}
