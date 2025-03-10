import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AccessToken } from 'src/utility/types';
import { UserRights } from 'src/users/entities/rights';

@Injectable()
export class PostGuard implements CanActivate {
  constructor(private _jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies.accessToken;

    try {
      this._jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (e) {
      throw new UnauthorizedException();
    }

    const data = this._jwtService.decode(token) as AccessToken;
    if (data.rights < UserRights.Seller) throw new ForbiddenException();
    return true;
  }
}
