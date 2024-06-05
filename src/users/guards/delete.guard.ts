import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AccessToken } from 'src/utility/types';
import { UserRights } from 'src/users/entities/rights';

@Injectable()
export class DeleteGuard implements CanActivate {
  constructor(private _jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request<{ id: string }, any, any>>();

    const userId = +req.params.id;
    const token = req.cookies.accessToken;

    try {
      const data = this._jwtService.decode(token) as AccessToken;
      if (data.id === userId || data.rights >= UserRights.Admin) return true;
    } catch {
      throw new ForbiddenException();
    }
  }
}
