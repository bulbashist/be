import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategory } from '../../product-categories/entities/product-category.entity';
import { ProductPhoto } from './product-photo.entity';
import { ProductManufacturer } from '../../product-manufacturers/entities/product-manufacturer.entity';
import { ProductsToOrders } from 'src/orders/entities/order.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Product {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column()
  @Index({ fulltext: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  @Index({ fulltext: true })
  description: string;

  @Column()
  width: number;

  @Column()
  breadth: number;

  @Column()
  height: number;

  @ManyToOne(() => ProductCategory, (pc) => pc.id, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  category: ProductCategory;

  @ManyToOne(() => ProductManufacturer, (pm) => pm.id, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  manufacturer: ProductManufacturer;

  @ManyToOne(() => User, (u) => u.id, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  seller: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  material: string;

  @Column()
  outOfStock: boolean;

  @Column({ nullable: true })
  priority: number;

  @Column({ nullable: true })
  discount: number;

  @UpdateDateColumn()
  date: Date;

  @OneToMany(() => ProductsToOrders, (pto) => pto.product, {
    // eager: true,
    cascade: true,
  })
  public productsToOrders: ProductsToOrders[];

  @OneToMany(() => ProductPhoto, (pp) => pp.product, { eager: true })
  photos: ProductPhoto[];

  @OneToMany(() => Comment, (c) => c.product, { eager: true })
  comments: Comment[];
}
