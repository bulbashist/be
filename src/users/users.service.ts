import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private _repo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.role = { id: 1 };

    const result = await this._repo.save(createUserDto);
    return result;
  }

  async findAll() {
    const users = await this._repo.find({
      select: {
        id: true,
        role: {
          id: true,
        },
        login: true,
        name: true,
      },
    });
    return users;
  }

  async findOneByID(id: number) {
    return this._repo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .select(['user.id', 'user.name'])
      .leftJoinAndSelect('user.orders', 'orders')
      .leftJoinAndSelect('orders.status', 'ostatus')
      .leftJoinAndSelect('orders.office', 'office')
      .leftJoinAndSelect('orders.products', 'pps')
      .leftJoinAndSelect('pps.product', 'product')
      .getOne();
  }

  async findOne(login: string, password?: string) {
    const user = await this._repo.findOne({
      where: {
        login,
        password,
      },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this._repo.save({
      id,
      ...updateUserDto,
    });
    return await this._repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const user = await this.findOneByID(id);
    try {
      const result = await this._repo.remove(user);
      return result;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
