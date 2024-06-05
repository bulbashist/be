import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column({ type: 'text' })
  @Index({ fulltext: true })
  text: string;

  @Column({ type: 'varchar', length: 45 })
  @Index({ fulltext: true })
  title: string;

  @UpdateDateColumn()
  date: Date;

  @Column({ length: 100 })
  previewImg: string;

  avgRating?: number;
}
