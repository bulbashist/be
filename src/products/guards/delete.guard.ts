import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AccessToken } from 'src/utility/types';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { UserRights } from 'src/users/entities/rights';

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

    const id = +req.params.id;
    const token = req.cookies.accessToken;

    const product = await this._repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product does not exist');

    const sellerId = product.seller.id;

    try {
      const data = this._jwtService.decode(token) as AccessToken;
      if (data.id === sellerId || data.rights >= UserRights.Admin) return true;
    } catch {
      throw new ForbiddenException();
    }
  }
}
