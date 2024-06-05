import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRights } from 'src/users/entities/rights';
import { AccessToken } from 'src/utility/types';

@Injectable()
export class AdminGuard implements CanActivate {
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
    if (data.rights < UserRights.Admin) throw new ForbiddenException();
    return true;
  }
}
