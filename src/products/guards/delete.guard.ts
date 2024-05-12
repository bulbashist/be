import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AccessToken } from 'src/utility/types';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class DeleteGuard implements CanActivate {
  constructor(
    @InjectRepository(Product)
    private _repo: Repository<Product>,
    private _jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request<{ id: string }, never, UpdateProductDto>>();

    const reviewId = +req.params.id;
    const token = req.cookies.accessToken;

    const userId = await this._repo
      .createQueryBuilder('review')
      .where('review.id = :id', { id: reviewId })
      .select('user_id', 'id')
      .getRawOne()
      .then((data) => data.id);

    try {
      const data = this._jwtService.decode(token) as AccessToken;
      if (data.id === userId || 1) return true;
    } catch {
      return false;
    }
  }
}
