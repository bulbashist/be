import { Product } from 'src/products/entities/product.entity';
import { User } from './user.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class Seller extends User {
  @OneToMany(() => Product, (p) => p.seller)
  products: Product[];
}
