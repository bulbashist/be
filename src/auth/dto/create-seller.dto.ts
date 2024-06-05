import { User } from 'src/users/entities/user.entity';

export type CreateSellerDto =
  | Pick<User, 'login' | 'password' | 'name' | 'phone'> & { vcode: string };
