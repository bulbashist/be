import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Office {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column()
  location: string;

  @Column({ type: 'decimal', precision: 8, scale: 5 })
  lng: number;

  @Column({ type: 'decimal', precision: 8, scale: 5 })
  lat: number;

  @OneToMany(() => Order, (o) => o.office)
  orders: Order[];
}
