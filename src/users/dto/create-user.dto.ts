import { UserRole } from '../entities/user-role.entity';

export class CreateUserDto {
  login: string;
  password?: string;
  name?: string;
  role?: Partial<UserRole>;
}
