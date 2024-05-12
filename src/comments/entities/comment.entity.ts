import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class Comment {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  text: string;

  @Column()
  rating: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Product, (p) => p.comments, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => User, (u) => u.comments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
