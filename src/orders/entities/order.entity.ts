import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import { OrderStatus } from './order-status.entity';
import { Office } from '../../offices/entities/office.entity';

@Entity()
export class Order {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @ManyToOne(() => OrderStatus, (os) => os.id, { eager: true })
  status: OrderStatus;

  @ManyToOne(() => User, (u) => u.id, { onDelete: 'RESTRICT' })
  user: User;

  @OneToMany(() => ProductsToOrders, (pto) => pto.order, {
    eager: true,
    cascade: true,
  })
  public products: ProductsToOrders[];

  @ManyToOne(() => Office, (o) => o.id, { onDelete: 'RESTRICT' })
  office: Office;

  @CreateDateColumn()
  date: Date;
}

@Entity()
export class ProductsToOrders {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column()
  public orderId: number;

  @Column()
  public productId: number;

  @Column({ nullable: true })
  public count: number;

  @ManyToOne(() => Order, (o) => o.products, {
    onDelete: 'CASCADE',
  })
  public order: Order;

  @ManyToOne(() => Product, (p) => p.productsToOrders, {
    cascade: ['insert'],
    eager: true,
  })
  public product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public sum: number;
}
