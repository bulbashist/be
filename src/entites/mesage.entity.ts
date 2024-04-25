import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.id)
  from: User;

  @ManyToOne(() => User, (u) => u.id)
  to: User;

  @Column()
  text: string;
}
