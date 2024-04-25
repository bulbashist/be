import { Injectable } from '@nestjs/common';
import { CreatePaycardDto } from './dto/create-paycard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PayCard } from './entities/paycard.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaycardsService {
  constructor(
    @InjectRepository(PayCard)
    private _repo: Repository<PayCard>,
  ) {}

  async create(createPaycardDto: CreatePaycardDto) {
    return await this._repo.save(createPaycardDto);
  }

  async findUsersAll(userId: number) {
    return await this._repo.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number) {
    return await this._repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const card = await this.findOne(id);
    return this._repo.remove(card);
  }
}
