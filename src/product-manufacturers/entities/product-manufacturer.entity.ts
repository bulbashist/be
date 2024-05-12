import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class ProductManufacturer {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Product, (p) => p.manufacturer)
  products: Product[];
}
