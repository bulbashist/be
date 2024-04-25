import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductPhoto {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Product, (p) => p.photos, { onDelete: 'CASCADE' })
  product: Product;
}
