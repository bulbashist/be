import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private _repo: Repository<Comment>,
  ) {}

  async create(dto: CreateCommentDto) {
    const isExists = await this._repo.exist({
      where: { user: { id: dto.user.id }, product: { id: dto.product.id } },
    });

    if (isExists) {
      return Promise.reject('Already exists');
    }

    const saveRes = await this._repo.save(dto);
    const result = await this._repo.findOne({
      where: { id: saveRes.id },
    });
    return result;
  }

  async remove(id: number) {
    return this._repo.delete(id);
  }
}
