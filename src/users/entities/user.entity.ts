import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { PayCard } from '../../paycards/entities/paycard.entity';
import { UserRole } from 'src/users/entities/user-role.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class User {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column({ unique: true, nullable: false })
  login: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  serviceOnly: boolean;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => PayCard, (pc) => pc.user)
  cards: PayCard[];

  @OneToMany(() => Order, (o) => o.user)
  orders: Order[];

  @OneToMany(() => Comment, (c) => c.user)
  comments: Comment[];

  @ManyToOne(() => UserRole, (ur) => ur.id, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  role: UserRole;

  @OneToMany(() => Product, (p) => p.seller)
  products: Product[];
}
