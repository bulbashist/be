import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class UserRole {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column()
  name: string;

  @Column()
  rights: number;
  // 0b00010101

  @OneToMany(() => User, (u) => u.role)
  users: User[];
}

export enum UserRoleEnum {
  User = 1,
  Seller = 2,
  Admin = 3,
  Blocked = 4,
}
