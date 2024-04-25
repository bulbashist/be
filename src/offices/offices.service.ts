import { Injectable } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Office } from './entities/office.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private _repo: Repository<Office>,
  ) {}

  async create(createOfficeDto: CreateOfficeDto) {
    return await this._repo.save(createOfficeDto);
  }

  async findAll() {
    return await this._repo.find();
  }

  async findOne(id: number) {
    return await this._repo.findOne({ where: { id } });
  }

  async update(id: number, updateOfficeDto: UpdateOfficeDto) {
    return await this._repo.save({ id, ...updateOfficeDto });
  }

  async remove(id: number) {
    const office = await this.findOne(id);
    return await this._repo.remove(office);
  }
}
